import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService.js';
import {
  generateOverviewPDF,
  generateProjectsPDF,
  generateFinancialPDF,
  generateTeamPDF,
} from '../utils/pdfGenerator.js';

export class ReportController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const data = await ReportService.getOverviewReport(userId, role);
      generateOverviewPDF(res, data, role);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const data = await ReportService.getProjectsReport(userId, role);
      generateProjectsPDF(res, data, role);
    } catch (error) {
      next(error);
    }
  }

  static async getFinancialReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const data = await ReportService.getFinancialReport(userId, role);
      generateFinancialPDF(res, data, role);
    } catch (error) {
      next(error);
    }
  }

  static async getTeamReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.user!;
      const data = await ReportService.getTeamReport(userId, role);
      generateTeamPDF(res, data, role);
    } catch (error) {
      next(error);
    }
  }
}
