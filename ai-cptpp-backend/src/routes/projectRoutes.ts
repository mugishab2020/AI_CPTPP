import { Router } from 'express';
import { z } from 'zod';
import { ProjectController } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate } from '../middleware/validation.js';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
  addTeamMemberSchema,
  removeTeamMemberSchema,
} from '../validators/projectValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', ProjectController.getAllProjects);
router.get('/:id', validate(getProjectSchema), ProjectController.getProjectById);
router.post('/', authorize('ADMIN', 'PROJECT_MANAGER'), validate(createProjectSchema), ProjectController.createProject);
router.patch('/:id', authorize('ADMIN', 'PROJECT_MANAGER'), validate(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', authorize('ADMIN'), validate(deleteProjectSchema), ProjectController.deleteProject);

// Team members
router.get('/:projectId/members', validate({ params: z.object({ projectId: z.string().uuid() }) }), ProjectController.getTeamMembers);
router.post('/:projectId/members', authorize('ADMIN', 'PROJECT_MANAGER'), validate(addTeamMemberSchema), ProjectController.addTeamMember);
router.delete('/:projectId/members/:userId', authorize('ADMIN', 'PROJECT_MANAGER'), validate(removeTeamMemberSchema), ProjectController.removeTeamMember);

export default router;