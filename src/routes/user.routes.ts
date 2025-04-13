import { Elysia } from "elysia";
import { searchDomain, searchIP } from "@src/controllers/searchController/search.controller";
import { createUser } from "@src/controllers/userController/create_user";
import { Type } from "@sinclair/typebox";

const CreateUserDTO = Type.Object({
  user_name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  user_role: Type.String(),
});

export const appRoutes = new Elysia()

.group("/search", (app) =>
  app
    .get("/ip_address/:ip", searchIP, {
      detail: {
        tags: ["Search"],
      },
    })
    .get("/domain_name/:domainName", searchDomain, {
      detail: {
        tags: ["Search"],
      },
    })
  )

  .group("/user", (app) =>
    app
      .post("/create", createUser, {
        body: CreateUserDTO,
        detail: {
          summary: "Create a new user",
          tags: ["User"],
        },
      })
  );
