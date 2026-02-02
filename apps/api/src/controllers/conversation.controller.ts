import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as conversationService from '../services/conversation.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      type: z.enum(['direct', 'group']),
      participantIds: z.array(z.string().uuid()),
      name: z.string().max(50).optional(),
    });
    const { type, participantIds, name } = schema.parse(req.body);
    const conversation = await conversationService.createConversation(req.user!.userId, type, participantIds, name);
    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const conversations = await conversationService.getConversations(req.user!.userId);
    res.json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const conversation = await conversationService.getConversation(req.params.id, req.user!.userId);
    res.json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const result = await conversationService.getMessages(req.params.id, req.user!.userId, cursor, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      content: z.string().min(1).max(2000),
      messageType: z.enum(['text', 'image']).default('text'),
      mediaUrl: z.string().url().optional(),
    });
    const { content, messageType, mediaUrl } = schema.parse(req.body);
    const message = await conversationService.sendMessage(req.params.id, req.user!.userId, content, messageType, mediaUrl);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    await conversationService.deleteMessage(req.params.messageId, req.user!.userId);
    res.json({ success: true, data: { message: 'Message deleted' } });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await conversationService.markAsRead(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function toggleMute(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await conversationService.toggleMute(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
