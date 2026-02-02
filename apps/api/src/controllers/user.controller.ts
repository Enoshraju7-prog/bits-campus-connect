import { Request, Response, NextFunction } from 'express';
import { updateProfileSchema, paginationSchema } from '@bits-campus-connect/shared';
import { z } from 'zod';
import * as userService from '../services/user.service';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getMe(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await userService.updateProfile(req.user!.userId, data);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getByUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getByUsername(req.params.username, req.user?.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const query = (req.query.q as string) || '';
    const campus = req.query.campus as string | undefined;
    const interest = req.query.interest as string | undefined;
    const result = await userService.searchUsers(query, campus as never, interest, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateInterests(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ interestIds: z.array(z.string().uuid()).max(10) });
    const { interestIds } = schema.parse(req.body);
    const user = await userService.updateInterests(req.user!.userId, interestIds);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getInterests(_req: Request, res: Response, next: NextFunction) {
  try {
    const interests = await userService.getAllInterests();
    res.json({ success: true, data: interests });
  } catch (err) {
    next(err);
  }
}

export async function getSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const suggestions = await userService.getSuggestions(req.user!.userId);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
}
