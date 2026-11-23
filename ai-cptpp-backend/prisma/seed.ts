import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create project manager
  const pmPassword = await bcrypt.hash('pm123', 10);
  const projectManager = await prisma.user.upsert({
    where: { email: 'pm@example.com' },
    update: {},
    create: {
      name: 'Project Manager',
      email: 'pm@example.com',
      password_hash: pmPassword,
      role: 'PROJECT_MANAGER',
    },
  });

  // Create client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Client User',
      email: 'client@example.com',
      password_hash: clientPassword,
      role: 'CLIENT',
    },
  });

  // Create a project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-id' },
    update: {},
    create: {
      id: 'sample-project-id',
      name: 'Sample Project',
      description: 'This is a sample project for demonstration.',
      status: 'ACTIVE',
      budget: 50000.00,
      client_id: client.id,
      manager_id: projectManager.id,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
    },
  });

  // Add team member
  await prisma.teamMember.upsert({
    where: {
      project_id_user_id: {
        project_id: project.id,
        user_id: projectManager.id,
      },
    },
    update: {},
    create: {
      project_id: project.id,
      user_id: projectManager.id,
      role: 'Project Manager',
    },
  });

  // Create invoice
  await prisma.invoice.upsert({
    where: { id: 'sample-invoice-id' },
    update: {},
    create: {
      id: 'sample-invoice-id',
      project_id: project.id,
      client_id: client.id,
      amount: 25000.00,
      due_date: new Date('2024-06-30'),
      status: 'PENDING',
    },
  });

  // Create communication
  await prisma.communication.upsert({
    where: { id: 'sample-comm-id' },
    update: {},
    create: {
      id: 'sample-comm-id',
      project_id: project.id,
      sender_id: projectManager.id,
      receiver_id: client.id,
      subject: 'Welcome to the project',
      body: 'Welcome! We are excited to work with you on this project.',
      type: 'MESSAGE',
      status: 'UNREAD',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });