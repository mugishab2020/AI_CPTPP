import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate } from '../middleware/validation.js';
import { updateUserSchema, getUserSchema, deleteUserSchema } from '../validators/userValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), UserController.getAllUsers);
router.get('/me', UserController.getCurrentUser);
router.get('/stats', authorize('ADMIN'), UserController.getUserStats);
router.post('/', authorize('ADMIN'), UserController.createUser);
router.get('/:id', authorize('ADMIN'), validate(getUserSchema), UserController.getUserById);
router.patch('/:id', authorize('ADMIN'), validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', authorize('ADMIN'), validate(deleteUserSchema), UserController.deleteUser);

export default router;