import { Elysia } from "elysia";
import {
  objectDTO,
  eventIDParamsDTO,
  objectIDParamsDTO,
  updateObjectDTO,
} from "@src/dto/object.dto";
import {
  createObject,
  getObject,
  deleteObject,
  updateObject,
} from "@src/controllers/objectController/object.controller";

export const objectRoute = new Elysia().group("/object", (app) =>
  app
    .post("/create", createObject, {
      body: objectDTO,
      detail: {
        summary: "Create a new object",
        tags: ["Object"],
      },
    })
    .get("/get/:event_id", getObject, {
      params: eventIDParamsDTO,
      detail: {
        summary: "Get object by event ID",
        tags: ["Object"],
      },
    })
    .delete("/delete/:id", deleteObject, {
      params: objectIDParamsDTO,
      detail: {
        summary: "Delete an object by ID",
        tags: ["Object"],
      },
    })
    .put("/update", updateObject, {
      body: updateObjectDTO,
      detail: {
        summary: "Update an object by ID",
        tags: ["Object"],
      },
    })
);
