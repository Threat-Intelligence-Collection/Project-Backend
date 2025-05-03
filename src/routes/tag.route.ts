import { Elysia } from "elysia";
import { createTag, createEventTag, getTagsByEventId } from "@src/controllers/tagController/tag.controller";
import { tagDTO, eventIDparams, eventTagDTO } from "@src/dto/tag.dto";

export const tagRoute = new Elysia().group("/tag", (app) =>
  app.post("/create", createTag, {
    body: tagDTO,
    detail: {
      summary: "Create a new tag",
      tags: ["Tag"],
    },
  }).get("/event/:event_id", getTagsByEventId, {
    params: eventIDparams,
    detail: {
      summary: "Get tags by event ID",
      tags: ["Tag"],
    },
    }).post("/event-tag", createEventTag, {
    body: eventTagDTO,
    detail: {
        summary: "Create a new event tag",
        tags: ["Tag"],
        },
    })
  
);
