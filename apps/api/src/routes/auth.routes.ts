import { Router, type IRouter } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router: IRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, error: { message: 'Too many requests. Try again later.' } },
});

router.post('/register', authLimiter, authController.register);
router.post('/verify-email', authLimiter, authController.verifyEmail);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);
router.post('/resend-otp', authLimiter, authController.resendOtp);

export default router;
