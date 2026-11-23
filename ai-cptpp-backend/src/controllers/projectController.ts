import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService.js';

export class ProjectController {
  static async getAllProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const projects = await ProjectService.getAllProjects(userId, userRole);
      res.json({
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const project = await ProjectService.getProjectById(id, userId, userRole);
      res.json({
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.body);
      res.status(201).json({
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await ProjectService.updateProject(id, req.body);
      res.json({
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProjectService.deleteProject(id);
      res.json({
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const members = await ProjectService.getTeamMembers(projectId);
      res.json({
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const { user_id, role } = req.body;
      const member = await ProjectService.addTeamMember(projectId, user_id, role);
      res.status(201).json({
        message: 'Team member added successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, userId } = req.params;
      await ProjectService.removeTeamMember(projectId, userId);
      res.json({
        message: 'Team member removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}