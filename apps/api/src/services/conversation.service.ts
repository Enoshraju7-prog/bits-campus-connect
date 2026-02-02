import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';
import { getIO } from '../socket';

export async function createConversation(
  creatorId: string,
  type: 'direct' | 'group',
  participantIds: string[],
  name?: string,
) {
  if (type === 'direct') {
    if (participantIds.length !== 1) throw new AppError(400, 'Direct conversation requires exactly one other participant');
    const otherId = participantIds[0];

    // Check if direct conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        type: 'direct',
        AND: [
          { participants: { some: { userId: creatorId } } },
          { participants: { some: { userId: otherId } } },
        ],
      },
    });
    if (existing) return existing;
  }

  if (type === 'group' && !name) throw new AppError(400, 'Group name is required');
  if (type === 'group' && participantIds.length < 1) throw new AppError(400, 'Group requires at least one other participant');

  const allParticipants = [creatorId, ...participantIds];

  const conversation = await prisma.conversation.create({
    data: {
      type,
      name: type === 'group' ? name : null,
      participants: {
        create: allParticipants.map((id) => ({
          userId: id,
          role: id === creatorId ? 'admin' : 'member',
        })),
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, username: true, name: true, profilePhotoUrl: true } } } },
    },
  });

  return conversation;
}

export async function getConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: { user: { select: { id: true, username: true, name: true, profilePhotoUrl: true } } },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { id: true, content: true, senderId: true, createdAt: true, messageType: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Compute unread counts
  const result = await Promise.all(
    conversations.map(async (conv) => {
      const participant = conv.participants.find((p) => p.userId === userId);
      const lastReadAt = participant?.lastReadAt || new Date(0);

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          createdAt: { gt: lastReadAt },
          senderId: { not: userId },
          isDeleted: false,
        },
      });

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        participants: conv.participants.map((p) => p.user),
        lastMessage: conv.messages[0] || null,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    }),
  );

  return result;
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: { user: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } } },
      },
    },
  });

  if (!conversation) throw new AppError(404, 'Conversation not found');

  const isMember = conversation.participants.some((p) => p.userId === userId);
  if (!isMember) throw new AppError(403, 'Not a member of this conversation');

  return conversation;
}

export async function getMessages(conversationId: string, userId: string, cursor?: string, limit: number = 50) {
  // Verify membership
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw new AppError(403, 'Not a member of this conversation');

  const where: Record<string, unknown> = { conversationId, isDeleted: false };
  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return {
    messages: messages.reverse(),
    nextCursor: messages.length === limit ? messages[0].createdAt.toISOString() : null,
  };
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  messageType: 'text' | 'image' = 'text',
  mediaUrl?: string,
) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  });
  if (!participant) throw new AppError(403, 'Not a member of this conversation');

  const message = await prisma.message.create({
    data: { conversationId, senderId, content, messageType, mediaUrl },
    include: {
      sender: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
  });

  // Update conversation's updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Broadcast to conversation room
  try {
    getIO().to(`conversation:${conversationId}`).emit('message:new', message);
  } catch {
    // Socket not initialized (tests)
  }

  return message;
}

export async function deleteMessage(messageId: string, userId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new AppError(404, 'Message not found');
  if (message.senderId !== userId) throw new AppError(403, 'Not authorized');

  return prisma.message.update({
    where: { id: messageId },
    data: { isDeleted: true },
  });
}

export async function markAsRead(conversationId: string, userId: string) {
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });

  try {
    getIO().to(`conversation:${conversationId}`).emit('message:read', { conversationId, userId });
  } catch {
    // Socket not initialized
  }

  return { message: 'Marked as read' };
}

export async function toggleMute(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw new AppError(403, 'Not a member');

  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { isMuted: !participant.isMuted },
  });
}
