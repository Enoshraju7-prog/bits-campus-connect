import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';
import type { CommunityPostType } from '@prisma/client';

export async function listCommunities(query: string, page: number, limit: number) {
  const where = query
    ? { name: { contains: query, mode: 'insensitive' as const } }
    : {};

  const [communities, total] = await Promise.all([
    prisma.community.findMany({
      where,
      select: { id: true, name: true, description: true, iconUrl: true, memberCount: true, isPrivate: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { memberCount: 'desc' },
    }),
    prisma.community.count({ where }),
  ]);

  return { communities, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createCommunity(userId: string, name: string, description: string, rules?: string) {
  if (name.length < 3 || name.length > 50) throw new AppError(400, 'Community name must be 3-50 characters');

  const existing = await prisma.community.findUnique({ where: { name } });
  if (existing) throw new AppError(409, 'Community name already taken');

  const community = await prisma.community.create({
    data: {
      name,
      description,
      rules,
      createdBy: userId,
      memberCount: 1,
      members: { create: { userId, role: 'admin' } },
    },
  });

  return community;
}

export async function getCommunity(communityId: string, userId?: string) {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: { creator: { select: { id: true, username: true, name: true } } },
  });
  if (!community) throw new AppError(404, 'Community not found');

  let membership = null;
  if (userId) {
    membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
  }

  return { ...community, isMember: !!membership, role: membership?.role || null };
}

export async function joinCommunity(communityId: string, userId: string) {
  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) throw new AppError(404, 'Community not found');

  const existing = await prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId } },
  });
  if (existing) throw new AppError(409, 'Already a member');

  await prisma.$transaction([
    prisma.communityMember.create({ data: { communityId, userId } }),
    prisma.community.update({ where: { id: communityId }, data: { memberCount: { increment: 1 } } }),
  ]);

  return { message: 'Joined community' };
}

export async function leaveCommunity(communityId: string, userId: string) {
  const membership = await prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId } },
  });
  if (!membership) throw new AppError(400, 'Not a member');

  await prisma.$transaction([
    prisma.communityMember.delete({ where: { communityId_userId: { communityId, userId } } }),
    prisma.community.update({ where: { id: communityId }, data: { memberCount: { decrement: 1 } } }),
  ]);

  return { message: 'Left community' };
}

export async function getPosts(
  communityId: string,
  sort: 'hot' | 'new' | 'top' = 'hot',
  period: 'day' | 'week' | 'month' | 'all' = 'all',
  page: number = 1,
  limit: number = 20,
  userId?: string,
) {
  const where: Record<string, unknown> = { communityId, isDeleted: false };

  if (sort === 'top' && period !== 'all') {
    const now = new Date();
    const periods: Record<string, number> = { day: 1, week: 7, month: 30 };
    const since = new Date(now.getTime() - periods[period] * 24 * 60 * 60 * 1000);
    where.createdAt = { gte: since };
  }

  const posts = await prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sort === 'new' ? { createdAt: 'desc' } : { upvotes: 'desc' },
  });

  // Get user votes if authenticated
  let userVotes: Record<string, string> = {};
  if (userId) {
    const votes = await prisma.postVote.findMany({
      where: { postId: { in: posts.map((p) => p.id) }, userId },
    });
    userVotes = Object.fromEntries(votes.map((v) => [v.postId, v.voteType]));
  }

  const scored = posts.map((post) => {
    let score = post.upvotes - post.downvotes;
    if (sort === 'hot') {
      const hoursAge = (Date.now() - post.createdAt.getTime()) / 3600000;
      score = score / Math.pow(hoursAge + 2, 1.5);
    }
    return { ...post, score, userVote: userVotes[post.id] || null };
  });

  if (sort === 'hot') scored.sort((a, b) => b.score - a.score);

  const total = await prisma.communityPost.count({ where });

  return { posts: scored, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createPost(
  communityId: string,
  authorId: string,
  title: string,
  content: string,
  postType: CommunityPostType = 'text',
) {
  const membership = await prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId: authorId } },
  });
  if (!membership) throw new AppError(403, 'Must be a member to post');

  return prisma.communityPost.create({
    data: { communityId, authorId, title, content, postType },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
  });
}

export async function votePost(postId: string, userId: string, voteType: 'up' | 'down') {
  const existing = await prisma.postVote.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    if (existing.voteType === voteType) {
      // Remove vote
      await prisma.$transaction([
        prisma.postVote.delete({ where: { postId_userId: { postId, userId } } }),
        prisma.communityPost.update({
          where: { id: postId },
          data: voteType === 'up' ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } },
        }),
      ]);
      return { vote: null };
    } else {
      // Switch vote
      await prisma.$transaction([
        prisma.postVote.update({ where: { postId_userId: { postId, userId } }, data: { voteType } }),
        prisma.communityPost.update({
          where: { id: postId },
          data:
            voteType === 'up'
              ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
              : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
        }),
      ]);
      return { vote: voteType };
    }
  }

  // New vote
  await prisma.$transaction([
    prisma.postVote.create({ data: { postId, userId, voteType } }),
    prisma.communityPost.update({
      where: { id: postId },
      data: voteType === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
    }),
  ]);
  return { vote: voteType };
}

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null, isDeleted: false },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
      replies: {
        where: { isDeleted: false },
        include: {
          author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
          replies: {
            where: { isDeleted: false },
            include: {
              author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments;
}

export async function createComment(postId: string, authorId: string, content: string, parentId?: string) {
  if (parentId) {
    // Check nesting depth (max 3 levels)
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) throw new AppError(404, 'Parent comment not found');
    if (parent.parentId) {
      const grandparent = await prisma.comment.findUnique({ where: { id: parent.parentId } });
      if (grandparent?.parentId) throw new AppError(400, 'Maximum comment depth reached');
    }
  }

  const comment = await prisma.comment.create({
    data: { postId, authorId, content, parentId },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
  });

  await prisma.communityPost.update({
    where: { id: postId },
    data: { commentCount: { increment: 1 } },
  });

  return comment;
}
