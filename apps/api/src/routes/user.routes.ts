import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as userController from '../controllers/user.controller';

const router: IRouter = Router();

router.get('/interests', userController.getInterests);
router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateProfile);
router.put('/me/interests', authenticate, userController.updateInterests);
router.get('/suggestions', authenticate, userController.getSuggestions);
router.get('/search', authenticate, userController.searchUsers);
router.get('/:username', authenticate, userController.getByUsername);

export default router;
