// @src/dto/CreateUserDTO.ts
import { t } from "elysia";

export const userDTO = t.Object({
  user_name: t.String(),
  email: t.String({ format: "email" }),
  password: t.String(),
  user_role: t.String(),
});

export const updateUserSchema = t.Object({
  id: t.String(),
  user_name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.Optional(t.String()),
  user_role: t.Optional(t.String()),
});
