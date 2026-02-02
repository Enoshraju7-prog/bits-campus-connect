import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Error handler (must be last)
app.use(errorHandler);

export default app;
