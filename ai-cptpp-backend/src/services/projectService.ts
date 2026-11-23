import prisma from '../config/database.js';

export class ProjectService {
  static async getAllProjects(userId?: string, userRole?: string) {
    let where: any = {};

    if (userRole === 'CLIENT') {
      where.client_id = userId;
    } else if (userRole === 'PROJECT_MANAGER') {
      where.OR = [
        { manager_id: userId },
        {
          team_members: {
            some: { user_id: userId },
          },
        },
      ];
    }
    // ADMIN can see all projects

    return prisma.project.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
        manager: {
          select: { id: true, name: true, email: true },
        },
        team_members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async getProjectById(id: string, userId?: string, userRole?: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
        manager: {
          select: { id: true, name: true, email: true },
        },
        team_members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        invoices: true,
        communications: {
          include: {
            sender: { select: { id: true, name: true } },
            receiver: { select: { id: true, name: true } },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Check permissions
    if (userRole === 'CLIENT' && project.client_id !== userId) {
      throw new Error('Access denied');
    }

    if (userRole === 'PROJECT_MANAGER' && project.manager_id !== userId) {
      const isTeamMember = project.team_members.some((tm: any) => tm.user_id === userId);
      if (!isTeamMember) {
        throw new Error('Access denied');
      }
    }

    return project;
  }

  static async createProject(data: any) {
    return prisma.project.create({
      data,
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async updateProject(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async deleteProject(id: string) {
    // Check if project has pending invoices
    const pendingInvoices = await prisma.invoice.count({
      where: { project_id: id, status: 'PENDING' },
    });

    if (pendingInvoices > 0) {
      throw new Error('Cannot delete project with pending invoices');
    }

    await prisma.project.delete({
      where: { id },
    });
  }

  static async getTeamMembers(projectId: string) {
    return prisma.teamMember.findMany({
      where: { project_id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  static async addTeamMember(projectId: string, userId: string, role: string) {
    // Check if user is already a team member
    const existing = await prisma.teamMember.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });

    if (existing) {
      throw new Error('User is already a team member');
    }

    return prisma.teamMember.create({
      data: {
        project_id: projectId,
        user_id: userId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async removeTeamMember(projectId: string, userId: string) {
    await prisma.teamMember.delete({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });
  }
}