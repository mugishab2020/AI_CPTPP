import PDFDocument from 'pdfkit';
import { Response } from 'express';

function setupDoc(res: Response, filename: string): PDFKit.PDFDocument {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);
  return doc;
}

function header(doc: PDFKit.PDFDocument, title: string, role: string) {
  doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor('#666')
    .text(`Role: ${role}  |  Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(1);
}

function sectionTitle(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.5);
  doc.fontSize(13).font('Helvetica-Bold').fillColor('#333').text(text);
  doc.moveDown(0.3);
}

function kv(doc: PDFKit.PDFDocument, label: string, value: string | number) {
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#555').text(`${label}: `, { continued: true });
  doc.font('Helvetica').fillColor('#000').text(String(value));
}

function table(doc: PDFKit.PDFDocument, rows: [string, string][]) {
  rows.forEach(([label, value]) => {
    doc.fontSize(10).font('Helvetica').fillColor('#333')
      .text(`• ${label}`, 60, doc.y, { continued: true, width: 300 });
    doc.text(value, { align: 'right' });
  });
}

// ─── Overview ────────────────────────────────────────────────────────────────

export function generateOverviewPDF(res: Response, data: any, role: string) {
  const doc = setupDoc(res, 'overview-report.pdf');
  header(doc, 'Overview Report', role);

  if (role === 'ADMIN') {
    sectionTitle(doc, 'Platform Summary');
    kv(doc, 'Total Projects', data.totalProjects);
    kv(doc, 'Total Users', data.totalUsers);
    kv(doc, 'Total Invoices', data.totalInvoices);
    kv(doc, 'Total Revenue', `$${data.totalRevenue.toFixed(2)}`);

    sectionTitle(doc, 'Projects by Status');
    table(doc, data.projectsByStatus.map((s: any) => [s.status, s._count.id]));

    sectionTitle(doc, 'Invoices by Status');
    table(doc, data.invoicesByStatus.map((s: any) => [s.status, s._count.id]));
  } else if (role === 'MANAGER') {
    sectionTitle(doc, 'Your Projects Summary');
    kv(doc, 'Total Projects', data.totalProjects);
    kv(doc, 'Total Invoices', data.invoiceStats._count.id);
    kv(doc, 'Total Invoice Amount', `$${(data.invoiceStats._sum.amount ?? 0).toFixed(2)}`);

    sectionTitle(doc, 'Projects by Status');
    table(doc, data.projectsByStatus.map((s: any) => [s.status, s._count.id]));

    sectionTitle(doc, 'Tasks by Status');
    table(doc, data.taskStats.map((s: any) => [s.status, s._count.id]));
  } else if (role === 'CLIENT') {
    sectionTitle(doc, 'Your Projects Summary');
    kv(doc, 'Total Projects', data.totalProjects);
    kv(doc, 'Total Invoices', data.invoiceStats._count.id);
    kv(doc, 'Total Billed', `$${(data.invoiceStats._sum.amount ?? 0).toFixed(2)}`);

    sectionTitle(doc, 'Projects by Status');
    table(doc, data.projectsByStatus.map((s: any) => [s.status, s._count.id]));
  } else {
    // TEAM_MEMBER
    sectionTitle(doc, 'Your Tasks Summary');
    kv(doc, 'Total Assigned Tasks', data.assignedTasks);
    kv(doc, 'Overdue Tasks', data.overdueTasks);

    sectionTitle(doc, 'Tasks by Status');
    table(doc, data.tasksByStatus.map((s: any) => [s.status, s._count.id]));

    sectionTitle(doc, 'Tasks by Priority');
    table(doc, data.tasksByPriority.map((s: any) => [s.priority, s._count.id]));
  }

  doc.end();
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function generateProjectsPDF(res: Response, data: any[], role: string) {
  const doc = setupDoc(res, 'projects-report.pdf');
  header(doc, 'Projects Report', role);

  if (data.length === 0) {
    doc.fontSize(11).text('No projects found.');
  }

  data.forEach((project: any, i: number) => {
    if (doc.y > 680) doc.addPage();
    sectionTitle(doc, `${i + 1}. ${project.name}`);
    kv(doc, 'Status', project.status);
    if (project.budget) kv(doc, 'Budget', `$${project.budget.toFixed(2)}`);
    if (project.client) kv(doc, 'Client', project.client.name);
    if (project.manager) kv(doc, 'Manager', project.manager.name);
    kv(doc, 'Tasks', project._count.tasks);
    kv(doc, 'Invoices', project._count.invoices);
    kv(doc, 'Team Members', project._count.team_members);

    const totalInvoiced = project.invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
    kv(doc, 'Total Invoiced', `$${totalInvoiced.toFixed(2)}`);

    const done = project.tasks.filter((t: any) => t.status === 'DONE').length;
    kv(doc, 'Tasks Completed', `${done} / ${project.tasks.length}`);
    doc.moveDown(0.5);
  });

  doc.end();
}

// ─── Financial ────────────────────────────────────────────────────────────────

export function generateFinancialPDF(res: Response, data: any, role: string) {
  const doc = setupDoc(res, 'financial-report.pdf');
  header(doc, 'Financial Report', role);

  sectionTitle(doc, 'Summary');
  kv(doc, 'Total Revenue Collected', `$${data.totalRevenue.toFixed(2)}`);
  kv(doc, 'Pending Amount', `$${data.pendingAmount.toFixed(2)}`);
  kv(doc, 'Overdue Amount', `$${data.overdueAmount.toFixed(2)}`);

  sectionTitle(doc, 'Invoices by Status');
  table(
    doc,
    data.invoicesByStatus.map((s: any) => [
      `${s.status} (${s._count.id} invoices)`,
      `$${(s._sum.amount ?? 0).toFixed(2)}`,
    ])
  );

  sectionTitle(doc, 'Recent Payments');
  if (data.recentPayments.length === 0) {
    doc.fontSize(10).text('No payments found.');
  }
  data.recentPayments.forEach((payment: any) => {
    if (doc.y > 700) doc.addPage();
    doc.fontSize(10).font('Helvetica').fillColor('#333')
      .text(
        `• ${payment.invoice.project.name} — ${payment.invoice.client.name}  |  $${payment.amount.toFixed(2)}  |  ${new Date(payment.paid_at).toLocaleDateString()}`
      );
  });

  doc.end();
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export function generateTeamPDF(res: Response, data: any, role: string) {
  const doc = setupDoc(res, 'team-report.pdf');
  header(doc, 'Team Report', role);

  if (role === 'TEAM_MEMBER') {
    sectionTitle(doc, 'Your Task Summary');
    kv(doc, 'Overdue Tasks', data.overdueTasks);

    sectionTitle(doc, 'Tasks by Status');
    table(doc, data.tasksByStatus.map((s: any) => [s.status, s._count.id]));

    sectionTitle(doc, 'Tasks by Priority');
    table(doc, data.tasksByPriority.map((s: any) => [s.priority, s._count.id]));
  } else {
    // ADMIN or MANAGER — array of members
    if (data.length === 0) {
      doc.fontSize(11).text('No team members found.');
    }
    data.forEach((member: any, i: number) => {
      if (doc.y > 680) doc.addPage();
      sectionTitle(doc, `${i + 1}. ${member.name}`);
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(member.email);
      doc.moveDown(0.2);
      kv(doc, 'Total Tasks', member.totalTasks);
      kv(doc, 'Completed', member.completedTasks);
      kv(doc, 'In Progress', member.inProgressTasks);
      kv(doc, 'Overdue', member.overdueTasks);
      doc.moveDown(0.5);
    });
  }

  doc.end();
}
