import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';

export async function sendRequest(requesterId: string, addresseeId: string) {
  if (requesterId === addresseeId) {
    throw new AppError(400, 'Cannot connect with yourself');
  }

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    },
  });

  if (existing) {
    if (existing.status === 'accepted') throw new AppError(409, 'Already connected');
    if (existing.status === 'pending') throw new AppError(409, 'Connection request already pending');
    if (existing.status === 'rejected') {
      return prisma.connection.update({
        where: { id: existing.id },
        data: { requesterId, addresseeId, status: 'pending' },
      });
    }
  }

  const blocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: requesterId, blockedId: addresseeId },
        { blockerId: addresseeId, blockedId: requesterId },
      ],
    },
  });
  if (blocked) throw new AppError(403, 'Cannot send request');

  return prisma.connection.create({
    data: { requesterId, addresseeId },
  });
}

export async function getPending(userId: string) {
  const [received, sent] = await Promise.all([
    prisma.connection.findMany({
      where: { addresseeId: userId, status: 'pending' },
      include: {
        requester: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: { requesterId: userId, status: 'pending' },
      include: {
        addressee: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { received, sent };
}

export async function acceptRequest(connectionId: string, userId: string) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) throw new AppError(404, 'Connection request not found');
  if (connection.addresseeId !== userId) throw new AppError(403, 'Not authorized');
  if (connection.status !== 'pending') throw new AppError(400, 'Request is not pending');

  return prisma.connection.update({
    where: { id: connectionId },
    data: { status: 'accepted' },
  });
}

export async function rejectRequest(connectionId: string, userId: string) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) throw new AppError(404, 'Connection request not found');
  if (connection.addresseeId !== userId) throw new AppError(403, 'Not authorized');
  if (connection.status !== 'pending') throw new AppError(400, 'Request is not pending');

  return prisma.connection.update({
    where: { id: connectionId },
    data: { status: 'rejected' },
  });
}

export async function removeConnection(connectionId: string, userId: string) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) throw new AppError(404, 'Connection not found');
  if (connection.requesterId !== userId && connection.addresseeId !== userId) {
    throw new AppError(403, 'Not authorized');
  }

  return prisma.connection.delete({ where: { id: connectionId } });
}

export async function getConnections(userId: string, page: number, limit: number) {
  const where = {
    status: 'accepted' as const,
    OR: [{ requesterId: userId }, { addresseeId: userId }],
  };

  const [connections, total] = await Promise.all([
    prisma.connection.findMany({
      where,
      include: {
        requester: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
        addressee: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.connection.count({ where }),
  ]);

  const users = connections.map((c) => ({
    connectionId: c.id,
    user: c.requesterId === userId ? c.addressee : c.requester,
    connectedAt: c.updatedAt,
  }));

  return { connections: users, total, page, limit, totalPages: Math.ceil(total / limit) };
}
