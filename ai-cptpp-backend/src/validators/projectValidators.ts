import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().optional(),
    budget: z.number().positive().optional(),
    client_id: z.string().uuid('Invalid client ID'),
    manager_id: z.string().uuid('Invalid manager ID'),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ON_HOLD']).optional(),
    budget: z.number().positive().optional(),
    client_id: z.string().uuid().optional(),
    manager_id: z.string().uuid().optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const addTeamMemberSchema = z.object({
  body: z.object({
    user_id: z.string().uuid(),
    role: z.string().min(1),
  }),
  params: z.object({
    projectId: z.string().uuid(),
  }),
});

export const removeTeamMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectInput = z.infer<typeof getProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type RemoveTeamMemberInput = z.infer<typeof removeTeamMemberSchema>;