import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/stats', PaymentController.getStats);
router.get('/method-stats', PaymentController.getMethodStats);
router.get('/', PaymentController.getPayments);
router.post('/invoice/:invoiceId', PaymentController.createPayment);

export default router;
