import { Router } from 'express';
import { CommunicationController } from '../controllers/communicationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createCommunicationSchema,
  updateCommunicationSchema,
  getCommunicationSchema,
  deleteCommunicationSchema,
} from '../validators/communicationValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', CommunicationController.getAllCommunications);
router.get('/:id', validate(getCommunicationSchema), CommunicationController.getCommunicationById);
router.post('/', validate(createCommunicationSchema), CommunicationController.createCommunication);
router.patch('/:id/read', validate(updateCommunicationSchema), CommunicationController.updateCommunication);
router.delete('/:id', validate(deleteCommunicationSchema), CommunicationController.deleteCommunication);

export default router;