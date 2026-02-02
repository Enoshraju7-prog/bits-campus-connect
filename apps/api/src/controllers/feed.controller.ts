import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paginationSchema } from '@bits-campus-connect/shared';
import * as feedService from '../services/feed.service';

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      content: z.string().min(1),
      postType: z.enum(['text', 'image', 'achievement']).default('text'),
      mediaUrls: z.array(z.string().url()).max(4).optional(),
    });
    const data = schema.parse(req.body);
    const post = await feedService.createPost(req.user!.userId, data.content, data.postType, data.mediaUrls);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await feedService.getFeed(req.user!.userId, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await feedService.getPost(req.params.id, req.user?.userId);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    await feedService.deletePost(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Post deleted' } });
  } catch (err) {
    next(err);
  }
}

export async function toggleLike(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await feedService.toggleLike(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ content: z.string().min(1).max(2000) });
    const { content } = schema.parse(req.body);
    const comment = await feedService.addComment(req.params.id, req.user!.userId, content);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await feedService.getComments(req.params.id, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getUserPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await feedService.getUserPosts(req.params.username, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
