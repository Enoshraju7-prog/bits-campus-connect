import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { prisma } from '../utils/prisma';
import { redis } from '../utils/redis';
import { AppError } from '../middleware/error';
import { BITS_EMAIL_REGEX } from '@bits-campus-connect/shared';
import type { Campus } from '@prisma/client';
import type { AuthPayload } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const OTP_EXPIRY_SECONDS = 600; // 10 minutes
const MAX_OTP_RESENDS_PER_HOUR = 3;
const BCRYPT_ROUNDS = 12;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function extractCampus(email: string): Campus {
  const match = email.match(/@(\w+)\.bits-pilani\.ac\.in$/i);
  if (!match) throw new AppError(400, 'Invalid BITS email');
  return match[1].toLowerCase() as Campus;
}

function generateTokens(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
}

export async function register(email: string, password: string, username: string, name: string) {
  if (!BITS_EMAIL_REGEX.test(email)) {
    throw new AppError(400, 'Only BITS Pilani email addresses are allowed');
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    throw new AppError(409, existing.email === email ? 'Email already registered' : 'Username already taken');
  }

  const campus = extractCampus(email);
  const batchYear = parseInt(email.substring(1, 5), 10);
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, name, campus, batchYear },
  });

  await sendOtp(email);

  return { userId: user.id, email: user.email, campus: user.campus };
}

export async function sendOtp(email: string) {
  const resendCountKey = `otp_resend_count:${email}`;
  const count = await redis.get(resendCountKey);
  if (count && parseInt(count, 10) >= MAX_OTP_RESENDS_PER_HOUR) {
    throw new AppError(429, 'Too many OTP requests. Try again later.');
  }

  const otp = generateOtp();
  await redis.setex(`otp:${email}`, OTP_EXPIRY_SECONDS, otp);

  const currentCount = await redis.incr(resendCountKey);
  if (currentCount === 1) {
    await redis.expire(resendCountKey, 3600);
  }

  if (resend) {
    await resend.emails.send({
      from: 'BITS Campus Connect <onboarding@resend.dev>',
      to: email,
      subject: 'Your verification code',
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    });
  } else {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
  }

  return { message: 'OTP sent successfully' };
}

export async function verifyEmail(email: string, otp: string) {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp || storedOtp !== otp) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  await redis.del(`otp:${email}`);

  const user = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  const payload: AuthPayload = { userId: user.id, email: user.email, campus: user.campus };
  const tokens = generateTokens(payload);

  await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);

  return { user: { id: user.id, email: user.email, username: user.username, campus: user.campus }, ...tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.isVerified) {
    throw new AppError(403, 'Email not verified. Please verify your email first.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const payload: AuthPayload = { userId: user.id, email: user.email, campus: user.campus };
  const tokens = generateTokens(payload);

  await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);

  return { user: { id: user.id, email: user.email, username: user.username, campus: user.campus, name: user.name }, ...tokens };
}

export async function logout(userId: string) {
  await redis.del(`refresh:${userId}`);
  return { message: 'Logged out successfully' };
}

export async function refreshTokens(refreshToken: string) {
  let payload: AuthPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as AuthPayload;
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const stored = await redis.get(`refresh:${payload.userId}`);
  if (!stored || stored !== refreshToken) {
    throw new AppError(401, 'Refresh token revoked');
  }

  const tokens = generateTokens({ userId: payload.userId, email: payload.email, campus: payload.campus });
  await redis.setex(`refresh:${payload.userId}`, 7 * 24 * 3600, tokens.refreshToken);

  return tokens;
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists
    return { message: 'If the email is registered, you will receive a reset code' };
  }

  await sendOtp(email);
  return { message: 'If the email is registered, you will receive a reset code' };
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp || storedOtp !== otp) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  await redis.del(`otp:${email}`);

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  return { message: 'Password reset successfully' };
}
