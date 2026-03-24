import { z } from 'zod';

export const createCommunicationSchema = z.object({
  body: z.object({
    project_id: z.string().uuid().optional(),
    receiver_id: z.string().uuid('Invalid receiver ID'),
    subject: z.string().min(1, 'Subject is required').max(200),
    body: z.string().min(1, 'Body is required'),
    type: z.enum(['MESSAGE', 'NOTIFICATION', 'SYSTEM']).optional(),
  }),
});

export const updateCommunicationSchema = z.object({
  body: z.object({
    status: z.enum(['UNREAD', 'READ']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getCommunicationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteCommunicationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>['body'];
export type UpdateCommunicationInput = z.infer<typeof updateCommunicationSchema>;
export type GetCommunicationInput = z.infer<typeof getCommunicationSchema>;
export type DeleteCommunicationInput = z.infer<typeof deleteCommunicationSchema>;