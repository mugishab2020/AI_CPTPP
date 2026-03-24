import prisma from '../config/database.js';

export class PaymentService {
  static async getPaymentStats(userId: string, userRole: string) {
    let invoiceWhere: any = {};
    if (userRole === 'CLIENT') invoiceWhere.client_id = userId;
    else if (userRole === 'MANAGER') invoiceWhere.project = { manager_id: userId };

    const [totalRevenue, paidAmount, pendingAmount, overdueAmount, totalCount, paidCount, pendingCount, overdueCount] =
      await Promise.all([
        prisma.invoice.aggregate({ where: invoiceWhere, _sum: { amount: true } }),
        prisma.invoice.aggregate({ where: { ...invoiceWhere, status: 'PAID' }, _sum: { amount: true } }),
        prisma.invoice.aggregate({ where: { ...invoiceWhere, status: 'PENDING' }, _sum: { amount: true } }),
        prisma.invoice.aggregate({ where: { ...invoiceWhere, status: 'OVERDUE' }, _sum: { amount: true } }),
        prisma.invoice.count({ where: invoiceWhere }),
        prisma.invoice.count({ where: { ...invoiceWhere, status: 'PAID' } }),
        prisma.invoice.count({ where: { ...invoiceWhere, status: 'PENDING' } }),
        prisma.invoice.count({ where: { ...invoiceWhere, status: 'OVERDUE' } }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      paidAmount: paidAmount._sum.amount ?? 0,
      pendingAmount: (pendingAmount._sum.amount ?? 0) + (overdueAmount._sum.amount ?? 0),
      totalCount,
      paidCount,
      pendingCount: pendingCount + overdueCount,
    };
  }

  static async getPayments(userId: string, userRole: string) {
    let invoiceWhere: any = {};
    if (userRole === 'CLIENT') invoiceWhere.client_id = userId;
    else if (userRole === 'MANAGER') invoiceWhere.project = { manager_id: userId };

    return prisma.payment.findMany({
      where: { invoice: invoiceWhere },
      include: {
        invoice: {
          select: {
            id: true,
            amount: true,
            status: true,
            project: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { paid_at: 'desc' },
    });
  }

  static async createPayment(invoiceId: string, data: { amount: number; method: string }) {
    // Mark invoice as PAID and create payment record in a transaction
    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoice_id: invoiceId,
          amount: data.amount,
          method: data.method as any,
          status: 'COMPLETED',
        },
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
      }),
      prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      }),
    ]);

    return payment;
  }

  static async getPaymentMethodStats(userId: string, userRole: string) {
    let invoiceWhere: any = {};
    if (userRole === 'CLIENT') invoiceWhere.client_id = userId;
    else if (userRole === 'MANAGER') invoiceWhere.project = { manager_id: userId };

    const grouped = await prisma.payment.groupBy({
      by: ['method'],
      where: { invoice: invoiceWhere },
      _count: { id: true },
    });

    const total = grouped.reduce((sum, g) => sum + g._count.id, 0);
    return grouped.map((g) => ({
      method: g.method,
      count: g._count.id,
      percentage: total > 0 ? Math.round((g._count.id / total) * 100) : 0,
    }));
  }
}
