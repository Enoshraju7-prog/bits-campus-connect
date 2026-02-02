import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paginationSchema } from '@bits-campus-connect/shared';
import * as connectionService from '../services/connection.service';

export async function sendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { addresseeId } = z.object({ addresseeId: z.string().uuid() }).parse(req.body);
    const connection = await connectionService.sendRequest(req.user!.userId, addresseeId);
    res.status(201).json({ success: true, data: connection });
  } catch (err) {
    next(err);
  }
}

export async function getPending(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await connectionService.getPending(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function accept(req: Request, res: Response, next: NextFunction) {
  try {
    const connection = await connectionService.acceptRequest(req.params.id, req.user!.userId);
    res.json({ success: true, data: connection });
  } catch (err) {
    next(err);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    const connection = await connectionService.rejectRequest(req.params.id, req.user!.userId);
    res.json({ success: true, data: connection });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await connectionService.removeConnection(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Connection removed' } });
  } catch (err) {
    next(err);
  }
}

export async function getConnections(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await connectionService.getConnections(req.user!.userId, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
