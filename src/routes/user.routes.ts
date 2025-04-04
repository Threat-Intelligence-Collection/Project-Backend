import { Elysia } from "elysia";
import { searchDomain, searchIP } from "@src/controllers/searchController/search.controller";

export const appRoutes = new Elysia()
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
