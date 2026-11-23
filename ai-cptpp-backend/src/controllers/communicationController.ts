import { Request, Response, NextFunction } from 'express';
import { CommunicationService } from '../services/communicationService.js';

export class CommunicationController {
  static async getAllCommunications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const communications = await CommunicationService.getAllCommunications(userId, userRole);
      res.json({
        data: communications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCommunicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const communication = await CommunicationService.getCommunicationById(id, userId);
      res.json({
        data: communication,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCommunication(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.userId;
      const communication = await CommunicationService.createCommunication(req.body, senderId);
      res.status(201).json({
        message: 'Communication created successfully',
        data: communication,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCommunication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const communication = await CommunicationService.updateCommunication(id, req.body, userId);
      res.json({
        message: 'Communication updated successfully',
        data: communication,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCommunication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      await CommunicationService.deleteCommunication(id, userId);
      res.json({
        message: 'Communication deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}