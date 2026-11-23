import prisma from '../config/database.js';

export class ReportService {
  /**
   * ADMIN: full platform overview
   * MANAGER: their projects overview
   * CLIENT: their projects overview
   * TEAM_MEMBER: their assigned tasks overview
   */
  static async getOverviewReport(userId: string, userRole: string) {
    if (userRole === 'ADMIN') {
      const [totalProjects, totalUsers, totalInvoices, totalRevenue, projectsByStatus, invoicesByStatus] =
        await Promise.all([
          prisma.project.count(),
          prisma.user.count(),
          prisma.invoice.count(),
          prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
          prisma.project.groupBy({ by: ['status'], _count: { id: true } }),
          prisma.invoice.groupBy({ by: ['status'], _count: { id: true } }),
        ]);

      return {
        totalProjects,
        totalUsers,
        totalInvoices,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        projectsByStatus,
        invoicesByStatus,
      };
    }

    if (userRole === 'MANAGER') {
      const projectWhere = { manager_id: userId };
      const [totalProjects, projectsByStatus, invoiceStats, taskStats] = await Promise.all([
        prisma.project.count({ where: projectWhere }),
        prisma.project.groupBy({ by: ['status'], where: projectWhere, _count: { id: true } }),
        prisma.invoice.aggregate({
          where: { project: { manager_id: userId } },
          _sum: { amount: true },
          _count: { id: true },
        }),
        prisma.task.groupBy({
          by: ['status'],
          where: { project: { manager_id: userId } },
          _count: { id: true },
        }),
      ]);

      return { totalProjects, projectsByStatus, invoiceStats, taskStats };
    }

    if (userRole === 'CLIENT') {
      const projectWhere = { client_id: userId };
      const [totalProjects, projectsByStatus, invoiceStats] = await Promise.all([
        prisma.project.count({ where: projectWhere }),
        prisma.project.groupBy({ by: ['status'], where: projectWhere, _count: { id: true } }),
        prisma.invoice.aggregate({
          where: { client_id: userId },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

      return { totalProjects, projectsByStatus, invoiceStats };
    }

    // TEAM_MEMBER
    const [assignedTasks, tasksByStatus, tasksByPriority] = await Promise.all([
      prisma.task.count({ where: { assigned_to: userId } }),
      prisma.task.groupBy({ by: ['status'], where: { assigned_to: userId }, _count: { id: true } }),
      prisma.task.groupBy({ by: ['priority'], where: { assigned_to: userId }, _count: { id: true } }),
    ]);

    return { assignedTasks, tasksByStatus, tasksByPriority };
  }

  /**
   * ADMIN/MANAGER: all projects or managed projects with full details
   * CLIENT: their projects with task/invoice summary
   * TEAM_MEMBER: projects they are a member of
   */
  static async getProjectsReport(userId: string, userRole: string) {
    let where: any = {};

    if (userRole === 'MANAGER') {
      where.manager_id = userId;
    } else if (userRole === 'CLIENT') {
      where.client_id = userId;
    } else if (userRole === 'TEAM_MEMBER') {
      where.team_members = { some: { user_id: userId } };
    }

    return prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, invoices: true, team_members: true } },
        tasks: {
          select: { status: true, priority: true },
        },
        invoices: {
          select: { amount: true, status: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * ADMIN: platform-wide financial report
   * MANAGER: financial report for their projects
   * CLIENT: their own invoices and payments
   * TEAM_MEMBER: not allowed (handled at route level)
   */
  static async getFinancialReport(userId: string, userRole: string) {
    let invoiceWhere: any = {};

    if (userRole === 'MANAGER') {
      invoiceWhere.project = { manager_id: userId };
    } else if (userRole === 'CLIENT') {
      invoiceWhere.client_id = userId;
    }

    const [invoicesByStatus, totalRevenue, pendingAmount, overdueAmount, recentPayments] = await Promise.all([
      prisma.invoice.groupBy({
        by: ['status'],
        where: invoiceWhere,
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          invoice: invoiceWhere,
        },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { ...invoiceWhere, status: 'PENDING' },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { ...invoiceWhere, status: 'OVERDUE' },
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: { invoice: invoiceWhere },
        include: {
          invoice: {
            select: {
              id: true,
              amount: true,
              project: { select: { id: true, name: true } },
              client: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { paid_at: 'desc' },
        take: 10,
      }),
    ]);

    return {
      invoicesByStatus,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      pendingAmount: pendingAmount._sum.amount ?? 0,
      overdueAmount: overdueAmount._sum.amount ?? 0,
      recentPayments,
    };
  }

  /**
   * ADMIN: all team members productivity
   * MANAGER: productivity of members in their projects
   * TEAM_MEMBER: their own productivity
   * CLIENT: not allowed (handled at route level)
   */
  static async getTeamReport(userId: string, userRole: string) {
    let taskWhere: any = {};
    let memberWhere: any = {};

    if (userRole === 'MANAGER') {
      taskWhere.project = { manager_id: userId };
      memberWhere.project = { manager_id: userId };
    } else if (userRole === 'TEAM_MEMBER') {
      taskWhere.assigned_to = userId;
    }

    if (userRole === 'TEAM_MEMBER') {
      const [tasksByStatus, tasksByPriority, overdueTasks] = await Promise.all([
        prisma.task.groupBy({ by: ['status'], where: taskWhere, _count: { id: true } }),
        prisma.task.groupBy({ by: ['priority'], where: taskWhere, _count: { id: true } }),
        prisma.task.count({
          where: {
            ...taskWhere,
            due_date: { lt: new Date() },
            status: { not: 'DONE' },
          },
        }),
      ]);
      return { tasksByStatus, tasksByPriority, overdueTasks };
    }

    // ADMIN or MANAGER
    const members = await prisma.user.findMany({
      where:
        userRole === 'MANAGER'
          ? { team_memberships: { some: { project: { manager_id: userId } } } }
          : { role: 'TEAM_MEMBER' },
      select: {
        id: true,
        name: true,
        email: true,
        assigned_tasks: {
          where: userRole === 'MANAGER' ? { project: { manager_id: userId } } : {},
          select: { status: true, priority: true, due_date: true },
        },
      },
    });

    return members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      totalTasks: member.assigned_tasks.length,
      completedTasks: member.assigned_tasks.filter((t) => t.status === 'DONE').length,
      inProgressTasks: member.assigned_tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      overdueTasks: member.assigned_tasks.filter(
        (t) => t.due_date && t.due_date < new Date() && t.status !== 'DONE'
      ).length,
    }));
  }
}
