import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as conversationController from '../controllers/conversation.controller';

const router: IRouter = Router();

router.use(authenticate);

router.post('/', conversationController.create);
router.get('/', conversationController.list);
router.get('/:id', conversationController.get);
router.get('/:id/messages', conversationController.getMessages);
router.post('/:id/messages', conversationController.sendMessage);
router.post('/:id/read', conversationController.markAsRead);
router.put('/:id/mute', conversationController.toggleMute);
router.delete('/messages/:messageId', conversationController.deleteMessage);

export default router;
