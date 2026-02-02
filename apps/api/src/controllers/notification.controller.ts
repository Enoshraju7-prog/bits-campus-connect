import { Request, Response, NextFunction } from 'express';
import { paginationSchema } from '@bits-campus-connect/shared';
import * as notificationService from '../services/notification.service';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await notificationService.getNotifications(req.user!.userId, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markAsRead(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Marked as read' } });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    res.json({ success: true, data: { message: 'All marked as read' } });
  } catch (err) {
    next(err);
  }
}
