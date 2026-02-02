import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as communityController from '../controllers/community.controller';

const router: IRouter = Router();

router.get('/', communityController.list);
router.post('/', authenticate, communityController.create);
router.get('/:id', authenticate, communityController.get);
router.post('/:id/join', authenticate, communityController.join);
router.post('/:id/leave', authenticate, communityController.leave);
router.get('/:id/posts', communityController.getPosts);
router.post('/:id/posts', authenticate, communityController.createPost);

// Post-specific routes
router.post('/posts/:id/vote', authenticate, communityController.vote);
router.get('/posts/:id/comments', communityController.getComments);
router.post('/posts/:id/comments', authenticate, communityController.createComment);

export default router;
