import { Elysia } from "elysia";
import {
  searchDomain,
  searchIP,
  searchAsset
} from "@src/controllers/searchController/search.controller";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
} from "@src/controllers/userController/user.controller";
import { userDTO, updateUserSchema, emailParamsDTO } from "@src/dto/user.dto";
import { GithubOAuthController } from "@src/controllers/loginController/githubLogIn.controller";
import { GoogleAuthController } from "@src/controllers/loginController/googleLogin.controller";

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
      }).get("/search/asset/:asset", searchAsset, {
        detail: {
          tags: ["Search_Asset"]
        }
      }).get("/login/oauth2/code/github", GithubOAuthController, {
        detail: {
          tags: ["Github_OAuth"],
        }
      }).get("/login/oauth2/code/google", GoogleAuthController, {
        detail: {
          tags: ["Google_OAuth"],
        }
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
        params: emailParamsDTO,
        detail: {
          summary: "Delete a user",
          tags: ["User"],
        },
      })
      .get("/get/:email", getUserByEmail, {
        params: emailParamsDTO,
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



