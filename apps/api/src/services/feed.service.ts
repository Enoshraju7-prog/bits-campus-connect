import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error';
import type { FeedPostType } from '@prisma/client';

export async function createPost(
  authorId: string,
  content: string,
  postType: FeedPostType = 'text',
  mediaUrls?: string[],
) {
  const post = await prisma.feedPost.create({
    data: {
      authorId,
      content,
      postType,
      media: mediaUrls
        ? {
            create: mediaUrls.map((url, index) => ({
              mediaUrl: url,
              orderIndex: index,
            })),
          }
        : undefined,
    },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
      media: { orderBy: { orderIndex: 'asc' } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return post;
}

export async function getFeed(userId: string, page: number, limit: number) {
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
  connectionIds.push(userId); // Include own posts

  const [posts, total] = await Promise.all([
    prisma.feedPost.findMany({
      where: { authorId: { in: connectionIds }, isDeleted: false },
      include: {
        author: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
        media: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId }, select: { userId: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedPost.count({
      where: { authorId: { in: connectionIds }, isDeleted: false },
    }),
  ]);

  const enriched = posts.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    likes: undefined,
    _count: undefined,
  }));

  return { posts: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPost(postId: string, userId?: string) {
  const post = await prisma.feedPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
      media: { orderBy: { orderIndex: 'asc' } },
      _count: { select: { likes: true, comments: true } },
      likes: userId ? { where: { userId }, select: { userId: true } } : false,
    },
  });

  if (!post || post.isDeleted) throw new AppError(404, 'Post not found');

  return {
    ...post,
    isLiked: userId ? (post.likes as { userId: string }[]).length > 0 : false,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
  };
}

export async function deletePost(postId: string, userId: string) {
  const post = await prisma.feedPost.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, 'Post not found');
  if (post.authorId !== userId) throw new AppError(403, 'Not authorized');

  return prisma.feedPost.update({
    where: { id: postId },
    data: { isDeleted: true },
  });
}

export async function toggleLike(postId: string, userId: string) {
  const existing = await prisma.feedPostLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.feedPostLike.delete({ where: { postId_userId: { postId, userId } } }),
      prisma.feedPost.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } }),
    ]);
    return { liked: false };
  }

  await prisma.$transaction([
    prisma.feedPostLike.create({ data: { postId, userId } }),
    prisma.feedPost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
  ]);
  return { liked: true };
}

export async function addComment(postId: string, authorId: string, content: string) {
  const comment = await prisma.feedPostComment.create({
    data: { postId, authorId, content },
    include: {
      author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
    },
  });

  await prisma.feedPost.update({
    where: { id: postId },
    data: { commentCount: { increment: 1 } },
  });

  return comment;
}

export async function getComments(postId: string, page: number, limit: number) {
  const [comments, total] = await Promise.all([
    prisma.feedPostComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, username: true, name: true, profilePhotoUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedPostComment.count({ where: { postId } }),
  ]);

  return { comments, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getUserPosts(username: string, page: number, limit: number) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new AppError(404, 'User not found');

  const [posts, total] = await Promise.all([
    prisma.feedPost.findMany({
      where: { authorId: user.id, isDeleted: false },
      include: {
        author: { select: { id: true, username: true, name: true, profilePhotoUrl: true, campus: true } },
        media: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedPost.count({ where: { authorId: user.id, isDeleted: false } }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
}
