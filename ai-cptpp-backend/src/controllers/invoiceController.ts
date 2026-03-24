import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoiceService.js';
import prisma from '../config/database.js';

export class InvoiceController {
  static async getAllInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const invoices = await InvoiceService.getAllInvoices(userId, userRole);
      res.json({
        data: invoices,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const invoice = await InvoiceService.getInvoiceById(id, userId, userRole);
      res.json({
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoiceService.createInvoice(req.body);
      res.status(201).json({
        message: 'Invoice created successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.updateInvoice(id, req.body);
      res.json({
        message: 'Invoice updated successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async payInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.payInvoice(id);
      res.json({
        message: 'Invoice paid successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFormData(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const projectWhere = role === 'MANAGER' ? { manager_id: userId } : {};
      const [projects, clients] = await Promise.all([
        prisma.project.findMany({
          where: projectWhere,
          select: { id: true, name: true, client_id: true, client: { select: { id: true, name: true } } },
          orderBy: { name: 'asc' },
        }),
        prisma.user.findMany({
          where: { role: 'CLIENT' },
          select: { id: true, name: true, email: true },
          orderBy: { name: 'asc' },
        }),
      ]);
      res.json({ data: { projects, clients } });
    } catch (error) {
      next(error);
    }
  }
}