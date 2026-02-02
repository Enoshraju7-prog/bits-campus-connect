import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as storyController from '../controllers/story.controller';

const router: IRouter = Router();

router.use(authenticate);

router.post('/', storyController.create);
router.get('/', storyController.list);
router.get('/me', storyController.myStories);
router.delete('/:id', storyController.remove);
router.post('/:id/view', storyController.view);
router.get('/:id/views', storyController.getViews);

export default router;
