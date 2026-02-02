import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as notificationController from '../controllers/notification.controller';

const router: IRouter = Router();

router.use(authenticate);

router.get('/', notificationController.list);
router.post('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;
