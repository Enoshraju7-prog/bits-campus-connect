import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { redis } from '../utils/redis';
import type { AuthPayload } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ONLINE_TTL = 300; // 5 minutes

let io: Server;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
      (socket as Socket & { user: AuthPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const user = (socket as Socket & { user: AuthPayload }).user;

    // Join personal room
    socket.join(`user:${user.userId}`);

    // Set online status
    await redis.setex(`online:${user.userId}`, ONLINE_TTL, '1');
    io.emit('user:online', { userId: user.userId });

    // Heartbeat to maintain online status
    const heartbeat = setInterval(async () => {
      await redis.setex(`online:${user.userId}`, ONLINE_TTL, '1');
    }, 60000);

    // Join conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user:typing', {
        conversationId,
        userId: user.userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user:typing', {
        conversationId,
        userId: user.userId,
        isTyping: false,
      });
    });

    socket.on('disconnect', async () => {
      clearInterval(heartbeat);
      await redis.del(`online:${user.userId}`);
      io.emit('user:offline', { userId: user.userId });
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
