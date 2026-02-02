import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '@bits-campus-connect/shared';
import * as authService from '../services/auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, username, name } = registerSchema.parse(req.body);
    const result = await authService.register(email, password, username, name);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(email, otp);
    res.cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await authService.logout(userId);
    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: { message: 'Refresh token required' } });
      return;
    }
    const result = await authService.refreshTokens(refreshToken);
    res.cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(email);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(email, otp, newPassword);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function resendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await authService.sendOtp(email);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
