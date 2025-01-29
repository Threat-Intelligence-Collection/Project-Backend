import { Elysia } from "elysia";
import { searchIP } from "@src/controllers/search.controller";

export const appRoutes = new Elysia()
  .get("/hello", () => "Hello from Elysia!", {
    detail: {
      tags: ["App"],
    },
  })
  .get("/search/:ip", searchIP, {
    detail: {
      tags: ["Search"],
    },
  });
