import { Router } from 'express';
import { InvoiceController } from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate } from '../middleware/validation.js';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoiceSchema,
  payInvoiceSchema,
} from '../validators/invoiceValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', InvoiceController.getAllInvoices);
router.get('/form-data', authorize('ADMIN', 'MANAGER'), InvoiceController.getFormData);
router.get('/:id', validate(getInvoiceSchema), InvoiceController.getInvoiceById);
router.post('/', authorize('ADMIN', 'PROJECT_MANAGER'), validate(createInvoiceSchema), InvoiceController.createInvoice);
router.patch('/:id', authorize('ADMIN', 'PROJECT_MANAGER'), validate(updateInvoiceSchema), InvoiceController.updateInvoice);
router.patch('/:id/pay', authorize('CLIENT'), validate(payInvoiceSchema), InvoiceController.payInvoice);

export default router;