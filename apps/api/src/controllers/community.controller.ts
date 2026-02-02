import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paginationSchema } from '@bits-campus-connect/shared';
import * as communityService from '../services/community.service';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const query = (req.query.q as string) || '';
    const result = await communityService.listCommunities(query, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      name: z.string().min(3).max(50),
      description: z.string().min(1),
      rules: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const community = await communityService.createCommunity(req.user!.userId, data.name, data.description, data.rules);
    res.status(201).json({ success: true, data: community });
  } catch (err) {
    next(err);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const community = await communityService.getCommunity(req.params.id, req.user?.userId);
    res.json({ success: true, data: community });
  } catch (err) {
    next(err);
  }
}

export async function join(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await communityService.joinCommunity(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function leave(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await communityService.leaveCommunity(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const sort = (req.query.sort as 'hot' | 'new' | 'top') || 'hot';
    const period = (req.query.period as 'day' | 'week' | 'month' | 'all') || 'all';
    const result = await communityService.getPosts(req.params.id, sort, period, page, limit, req.user?.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      title: z.string().min(1).max(300),
      content: z.string().min(1).max(10000),
      postType: z.enum(['text', 'image', 'link']).default('text'),
    });
    const data = schema.parse(req.body);
    const post = await communityService.createPost(req.params.id, req.user!.userId, data.title, data.content, data.postType);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function vote(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ voteType: z.enum(['up', 'down']) });
    const { voteType } = schema.parse(req.body);
    const result = await communityService.votePost(req.params.id, req.user!.userId, voteType);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await communityService.getComments(req.params.id);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      content: z.string().min(1).max(5000),
      parentId: z.string().uuid().optional(),
    });
    const { content, parentId } = schema.parse(req.body);
    const comment = await communityService.createComment(req.params.id, req.user!.userId, content, parentId);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}
