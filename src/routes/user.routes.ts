import { Elysia } from "elysia";
import { searchDomain, searchIP, searchAsset } from "@src/controllers/searchController/search.controller";
import { GithubOAuthController } from "@src/controllers/loginController/githubLogIn.controller";
import { GoogleAuthController } from "@src/controllers/loginController/googleLogin.controller";

export const appRoutes = new Elysia()
  .get("/search/ip_address/:ip", searchIP, {
    detail: {
      tags: ["Search_IP"],
    },
  })
  .get("/search/domain_name/:domainName", searchDomain, {
    detail: {
      tags: ["Search_Domain"],
    },
  })
  .get("/search/asset/:asset", searchAsset, {
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
  });
