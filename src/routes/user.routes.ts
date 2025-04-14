import { Elysia } from "elysia";
import { searchDomain, searchIP, searchAsset } from "@src/controllers/searchController/search.controller";

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
  });
