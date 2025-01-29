import { Elysia } from "elysia";
import { searchDomain, searchIP } from "@src/controllers/search.controller";

export const appRoutes = new Elysia()
  .get("/hello", () => "Hello from Elysia!", {
    detail: {
      tags: ["App"],
    },
  })
  .get("/search/ip_address/:ip", searchIP, {
    detail: {
      tags: ["Search"],
    },
  })
  .get("/search/domain_name/:domainName", searchDomain, {
    detail: {
      tags: ["Search"],
    },
  });
