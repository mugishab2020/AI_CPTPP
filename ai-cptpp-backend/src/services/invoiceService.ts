import prisma from '../config/database.js';

export class InvoiceService {
  static async getAllInvoices(userId?: string, userRole?: string) {
    let where: any = {};

    if (userRole === 'CLIENT') {
      where.client_id = userId;
    } else if (userRole === 'PROJECT_MANAGER') {
      where.project = {
        OR: [
          { manager_id: userId },
          {
            team_members: {
              some: { user_id: userId },
            },
          },
        ],
      };
    }
    // ADMIN can see all invoices

    return prisma.invoice.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async getInvoiceById(id: string, userId?: string, userRole?: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, manager: { select: { id: true, name: true } } },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Check permissions
    if (userRole === 'CLIENT' && invoice.client_id !== userId) {
      throw new Error('Access denied');
    }

    if (userRole === 'PROJECT_MANAGER') {
      const project = await prisma.project.findUnique({
        where: { id: invoice.project_id },
        include: { team_members: true },
      });

      if (!project || (project.manager_id !== userId && !project.team_members.some((tm: any) => tm.user_id === userId))) {
        throw new Error('Access denied');
      }
    }

    return invoice;
  }

  static async createInvoice(data: any) {
    return prisma.invoice.create({
      data,
      include: {
        project: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async updateInvoice(id: string, data: any) {
    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async payInvoice(id: string) {
    return prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' },
      include: {
        project: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  }
}