import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as storyService from '../services/story.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      contentType: z.enum(['image', 'text']),
      mediaUrl: z.string().url().optional(),
      textContent: z.string().max(500).optional(),
      backgroundColor: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    });
    const data = schema.parse(req.body);
    const story = await storyService.createStory(
      req.user!.userId, data.contentType, data.mediaUrl, data.textContent, data.backgroundColor,
    );
    res.status(201).json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const stories = await storyService.getStoriesForUser(req.user!.userId);
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
}

export async function myStories(req: Request, res: Response, next: NextFunction) {
  try {
    const stories = await storyService.getMyStories(req.user!.userId);
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await storyService.deleteStory(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Story deleted' } });
  } catch (err) {
    next(err);
  }
}

export async function view(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await storyService.viewStory(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getViews(req: Request, res: Response, next: NextFunction) {
  try {
    const views = await storyService.getStoryViews(req.params.id, req.user!.userId);
    res.json({ success: true, data: views });
  } catch (err) {
    next(err);
  }
}
