import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import connectionRoutes from './routes/connection.routes';
import conversationRoutes from './routes/conversation.routes';
import communityRoutes from './routes/community.routes';
import storyRoutes from './routes/story.routes';
import feedRoutes from './routes/feed.routes';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './middleware/error';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    // Allow exact match, Vercel preview deployments, and localhost
    if (
      origin === allowed ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost')
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/connections', connectionRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
