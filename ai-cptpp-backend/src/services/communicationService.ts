import prisma from '../config/database.js';

export class CommunicationService {
  static async getAllCommunications(userId?: string, userRole?: string) {
    let where: any = {
      OR: [
        { sender_id: userId },
        { receiver_id: userId },
      ],
    };

    if (userRole === 'CLIENT') {
      // Clients can only see communications related to their projects
      where.project = {
        client_id: userId,
      };
    }

    return prisma.communication.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async getCommunicationById(id: string, userId: string) {
    const communication = await prisma.communication.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });

    if (!communication) {
      throw new Error('Communication not found');
    }

    // Check if user can access this communication
    if (communication.sender_id !== userId && communication.receiver_id !== userId) {
      throw new Error('Access denied');
    }

    return communication;
  }

  static async createCommunication(data: any, senderId: string) {
    return prisma.communication.create({
      data: {
        ...data,
        sender_id: senderId,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  static async updateCommunication(id: string, data: any, userId: string) {
    // Only receiver can mark as read
    const communication = await prisma.communication.findUnique({
      where: { id },
    });

    if (!communication) {
      throw new Error('Communication not found');
    }

    if (communication.receiver_id !== userId) {
      throw new Error('Access denied');
    }

    return prisma.communication.update({
      where: { id },
      data,
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  static async deleteCommunication(id: string, userId: string) {
    const communication = await prisma.communication.findUnique({
      where: { id },
    });

    if (!communication) {
      throw new Error('Communication not found');
    }

    // Only sender can delete
    if (communication.sender_id !== userId) {
      throw new Error('Access denied');
    }

    await prisma.communication.delete({
      where: { id },
    });
  }
}