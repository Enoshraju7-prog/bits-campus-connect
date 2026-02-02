import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';
import type { Campus } from '@prisma/client';

const USER_SELECT = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  profilePhotoUrl: true,
  coverPhotoUrl: true,
  campus: true,
  batchYear: true,
  currentFocus: true,
  isVerified: true,
  createdAt: true,
  interests: { include: { interest: true } },
};

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; bio?: string; batchYear?: number; currentFocus?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: USER_SELECT,
  });
}

export async function getByUsername(username: string, currentUserId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: USER_SELECT,
  });
  if (!user) throw new AppError(404, 'User not found');

  let connectionStatus: string | null = null;
  if (currentUserId && currentUserId !== user.id) {
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: user.id },
          { requesterId: user.id, addresseeId: currentUserId },
        ],
      },
    });
    connectionStatus = connection?.status ?? null;
  }

  return { ...user, connectionStatus };
}

export async function searchUsers(
  query: string,
  campus: Campus | undefined,
  interestId: string | undefined,
  page: number,
  limit: number,
) {
  const where: Record<string, unknown> = {};
  const conditions: unknown[] = [];

  if (query) {
    conditions.push({
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
    });
  }
  if (campus) conditions.push({ campus });
  if (interestId) conditions.push({ interests: { some: { interestId } } });
  if (conditions.length > 0) where.AND = conditions;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true, batchYear: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateInterests(userId: string, interestIds: string[]) {
  if (interestIds.length > 10) {
    throw new AppError(400, 'Maximum 10 interests allowed');
  }

  await prisma.userInterest.deleteMany({ where: { userId } });
  await prisma.userInterest.createMany({
    data: interestIds.map((interestId) => ({ userId, interestId })),
  });

  return prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
}

export async function getAllInterests() {
  return prisma.interest.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
}

export async function getSuggestions(userId: string, limit: number = 10) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { interests: true },
  });
  if (!user) throw new AppError(404, 'User not found');

  const existingConnections = await prisma.connection.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });

  const connectedIds = new Set(
    existingConnections.flatMap((c) => [c.requesterId, c.addresseeId]),
  );
  connectedIds.add(userId);

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: Array.from(connectedIds) },
      isVerified: true,
      isActive: true,
    },
    include: { interests: true },
    take: 50,
  });

  const userInterestIds = new Set(user.interests.map((i) => i.interestId));

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (candidate.campus === user.campus) score += 3;
    candidate.interests.forEach((i) => {
      if (userInterestIds.has(i.interestId)) score += 2;
    });
    return { user: candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ user: u }) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    profilePhotoUrl: u.profilePhotoUrl,
    campus: u.campus,
    batchYear: u.batchYear,
  }));
}
