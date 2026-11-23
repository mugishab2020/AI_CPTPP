import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'CLIENT', 'TEAM_MEMBER']).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;