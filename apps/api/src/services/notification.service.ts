import { prisma } from '../utils/prisma';
import { getIO } from '../socket';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, body, data: data ? JSON.parse(JSON.stringify(data)) : undefined },
  });

  try {
    getIO().to(`user:${userId}`).emit('notification:new', notification);
  } catch {
    // Socket not initialized
  }

  return notification;
}

export async function getNotifications(userId: string, page: number, limit: number) {
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return { notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
