import { Router, type IRouter } from 'express';
import { authenticate } from '../middleware/auth';
import * as connectionController from '../controllers/connection.controller';

const router: IRouter = Router();

router.use(authenticate);

router.post('/request', connectionController.sendRequest);
router.get('/pending', connectionController.getPending);
router.get('/', connectionController.getConnections);
router.post('/:id/accept', connectionController.accept);
router.post('/:id/reject', connectionController.reject);
router.delete('/:id', connectionController.remove);

export default router;
