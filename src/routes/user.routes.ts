import { Elysia } from "elysia";
import {
  searchDomain,
  searchIP,
} from "@src/controllers/searchController/search.controller";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
} from "@src/controllers/userController/user.controller";
import { userDTO, updateUserSchema } from "@src/dto/user.dto";

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
        body: userDTO,
        detail: {
          summary: "Create a new user",
          tags: ["User"],
        },
      })
      .delete("/delete/:email", deleteUser, {
        detail: {
          summary: "Delete a user",
          tags: ["User"],
        },
      })
      .get("/get/:email", getUserByEmail, {
        detail: {
          summary: "Get user by email",
          tags: ["User"],
        },
      })
      .put("/update", updateUser, {
        body: updateUserSchema,
        detail: {
          summary: "Update user role",
          tags: ["User"],
        },
      })
  );
