import { Router } from 'express';
import { ReportController } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = Router();

router.use(authenticate);

// All roles can access their own overview
router.get('/overview', ReportController.getOverview);

// All roles can access projects report (scoped by role in service)
router.get('/projects', ReportController.getProjectsReport);

// Financial: ADMIN, MANAGER, CLIENT only
router.get(
  '/financial',
  authorize('ADMIN', 'MANAGER', 'CLIENT'),
  ReportController.getFinancialReport
);

// Team productivity: ADMIN, MANAGER, TEAM_MEMBER only
router.get(
  '/team',
  authorize('ADMIN', 'MANAGER', 'TEAM_MEMBER'),
  ReportController.getTeamReport
);

export default router;
