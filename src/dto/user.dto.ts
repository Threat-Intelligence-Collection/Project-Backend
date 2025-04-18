import { t } from "elysia";

export type UserRole = "admin" | "user" | "guest";

export const userDTO = t.Object({
  user_name: t.String({ minLength: 5 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  user_role: t.Enum({ admin: "admin", user: "user", guest: "guest" }),
});

export const updateUserSchema = t.Object({
  id: t.String({ minLength: 1 }),
  user_name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.Optional(t.String()),
  user_role: t.Optional(t.String()),
});

export const emailParamsDTO = t.Object({
  email: t.String({ format: "email" }),
});
