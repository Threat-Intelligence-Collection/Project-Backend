import { Elysia } from "elysia";
import {
  createTag,
  createEventTag,
  getTagsByEventId,
  deleteTag,
  deleteTaginEvent,
  updateTag,
} from "@src/controllers/tagController/tag.controller";
import {
  tagDTO,
  eventIDparams,
  eventTagDTO,
  updateTagDTO,
} from "@src/dto/tag.dto";

export const tagRoute = new Elysia().group("/tag", (app) =>
  app
    .post("/create", createTag, {
      body: tagDTO,
      detail: {
        summary: "Create a new tag",
        tags: ["Tag"],
      },
    })
    .post("/event-tag", createEventTag, {
      body: eventTagDTO,
      detail: {
        summary: "Create a new event tag",
        tags: ["Tag"],
      },
    })
    .get("/event/:event_id", getTagsByEventId, {
      params: eventIDparams,
      detail: {
        summary: "Get tags by event ID",
        tags: ["Tag"],
      },
    })
    .delete("/delete", deleteTag, {
      body: tagDTO,
      detail: {
        summary: "Delete a tag",
        tags: ["Tag"],
      },
    })
    .delete("/delete-event-tag", deleteTaginEvent, {
      body: eventTagDTO,
      detail: {
        summary: "Delete a tag from an event",
        tags: ["Tag"],
      },
    })
    .put("/update", updateTag, {
      body: updateTagDTO,
      detail: {
        summary: "Update a tag",
        tags: ["Tag"],
      },
    })
);
