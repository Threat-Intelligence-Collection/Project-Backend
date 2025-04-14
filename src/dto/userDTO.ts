// @src/dto/CreateUserDTO.ts
import { t } from "elysia";

export const userDTO = t.Object({
  user_name: t.String(),
  email: t.String({ format: "email" }),
  password: t.String(),
  user_role: t.String(),
});
