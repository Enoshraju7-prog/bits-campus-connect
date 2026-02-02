import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as feedController from '../controllers/feed.controller';

const router: IRouter = Router();

router.get('/', authenticate, feedController.getFeed);
router.post('/posts', authenticate, feedController.createPost);
router.get('/posts/:id', authenticate, feedController.getPost);
router.delete('/posts/:id', authenticate, feedController.deletePost);
router.post('/posts/:id/like', authenticate, feedController.toggleLike);
router.post('/posts/:id/comments', authenticate, feedController.addComment);
router.get('/posts/:id/comments', authenticate, feedController.getComments);
router.get('/users/:username/posts', authenticate, feedController.getUserPosts);

export default router;
