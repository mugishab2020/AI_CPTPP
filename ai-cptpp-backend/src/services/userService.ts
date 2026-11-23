import prisma from '../config/database.js';
import { hashPassword } from '../utils/hash.js';

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        _count: { select: { managed_projects: true, client_projects: true, team_memberships: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async getUserStats() {
    const [total, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
    ]);
    return { total, byRole };
  }

  static async createUser(data: { name: string; email: string; password: string; role: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');
    const password_hash = await hashPassword(data.password);
    return prisma.user.create({
      data: { name: data.name, email: data.email, password_hash, role: data.role as any },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        managed_projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        client_projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateUser(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updated_at: true,
      },
    });

    return user;
  }

  static async deleteUser(id: string) {
    // Check if user has active projects
    const managedProjects = await prisma.project.count({
      where: { manager_id: id, status: { in: ['ACTIVE', 'DRAFT'] } },
    });

    const clientProjects = await prisma.project.count({
      where: { client_id: id, status: { in: ['ACTIVE', 'DRAFT'] } },
    });

    if (managedProjects > 0 || clientProjects > 0) {
      throw new Error('Cannot delete user with active projects');
    }

    await prisma.user.delete({
      where: { id },
    });
  }

  static async getCurrentUser(id: string) {
    return this.getUserById(id);
  }
}