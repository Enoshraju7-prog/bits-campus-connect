import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';
import type { ContentType } from '@prisma/client';

const STORY_DURATION_HOURS = 24;
const MAX_STORIES_PER_DAY = 10;

export async function createStory(
  userId: string,
  contentType: ContentType,
  mediaUrl?: string,
  textContent?: string,
  backgroundColor?: string,
) {
  // Check daily limit
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.story.count({
    where: { userId, createdAt: { gte: dayAgo } },
  });
  if (recentCount >= MAX_STORIES_PER_DAY) {
    throw new AppError(429, `Maximum ${MAX_STORIES_PER_DAY} stories per 24 hours`);
  }

  const expiresAt = new Date(Date.now() + STORY_DURATION_HOURS * 60 * 60 * 1000);

  return prisma.story.create({
    data: { userId, contentType, mediaUrl, textContent, backgroundColor, expiresAt },
    include: {
      user: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
  });
}

export async function getStoriesForUser(userId: string) {
  // Get connection IDs
  const connections = await prisma.connection.findMany({
    where: {
      status: 'accepted',
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });

  const connectionIds = connections.map((c) =>
    c.requesterId === userId ? c.addresseeId : c.requesterId,
  );
  connectionIds.push(userId); // Include own stories

  const stories = await prisma.story.findMany({
    where: {
      userId: { in: connectionIds },
      expiresAt: { gt: new Date() },
    },
    include: {
      user: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
      views: { where: { viewerId: userId }, select: { viewerId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Group by user
  const grouped = new Map<string, { user: typeof stories[0]['user']; stories: typeof stories; hasUnseen: boolean }>();

  for (const story of stories) {
    const existing = grouped.get(story.userId);
    const viewed = story.views.length > 0;

    if (existing) {
      existing.stories.push(story);
      if (!viewed) existing.hasUnseen = true;
    } else {
      grouped.set(story.userId, {
        user: story.user,
        stories: [story],
        hasUnseen: !viewed,
      });
    }
  }

  // Own stories first, then unseen, then seen
  const result = Array.from(grouped.values());
  result.sort((a, b) => {
    if (a.user.id === userId) return -1;
    if (b.user.id === userId) return 1;
    if (a.hasUnseen && !b.hasUnseen) return -1;
    if (!a.hasUnseen && b.hasUnseen) return 1;
    return 0;
  });

  return result;
}

export async function getMyStories(userId: string) {
  return prisma.story.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    include: { _count: { select: { views: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteStory(storyId: string, userId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) throw new AppError(404, 'Story not found');
  if (story.userId !== userId) throw new AppError(403, 'Not authorized');

  return prisma.story.delete({ where: { id: storyId } });
}

export async function viewStory(storyId: string, viewerId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) throw new AppError(404, 'Story not found');
  if (story.userId === viewerId) return { viewed: true }; // Don't count own views

  await prisma.storyView.upsert({
    where: { storyId_viewerId: { storyId, viewerId } },
    create: { storyId, viewerId },
    update: {},
  });

  return { viewed: true };
}

export async function getStoryViews(storyId: string, userId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) throw new AppError(404, 'Story not found');
  if (story.userId !== userId) throw new AppError(403, 'Only story owner can view this');

  return prisma.storyView.findMany({
    where: { storyId },
    include: { viewer: { select: { id: true, username: true, name: true, profilePhotoUrl: true } } },
    orderBy: { viewedAt: 'desc' },
  });
}

export async function cleanupExpired() {
  const result = await prisma.story.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
