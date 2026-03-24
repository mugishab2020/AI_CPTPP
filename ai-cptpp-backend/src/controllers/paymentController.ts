import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService.js';

export class PaymentController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const stats = await PaymentService.getPaymentStats(userId, role);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  static async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const payments = await PaymentService.getPayments(userId, role);
      res.json({ data: payments });
    } catch (error) {
      next(error);
    }
  }

  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const invoiceId = req.params.invoiceId!;
      const { amount, method } = req.body;
      const payment = await PaymentService.createPayment(invoiceId, { amount, method });
      res.status(201).json({ message: 'Payment recorded successfully', data: payment });
    } catch (error) {
      next(error);
    }
  }

  static async getMethodStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const stats = await PaymentService.getPaymentMethodStats(userId, role);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}
