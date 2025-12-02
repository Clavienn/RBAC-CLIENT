import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "editor", "viewer"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  user: UserSchema,
});

export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
