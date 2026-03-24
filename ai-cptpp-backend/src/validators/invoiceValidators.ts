import { z } from 'zod';

export const createInvoiceSchema = z.object({
  body: z.object({
    project_id: z.string().min(1, 'Project is required'),
    client_id: z.string().min(1, 'Client is required'),
    amount: z.number().positive('Amount must be positive'),
    due_date: z.string().min(1, 'Due date is required'),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    due_date: z.string().optional(),
    status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getInvoiceSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const payInvoiceSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>['body'];
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type GetInvoiceInput = z.infer<typeof getInvoiceSchema>;
export type PayInvoiceInput = z.infer<typeof payInvoiceSchema>;