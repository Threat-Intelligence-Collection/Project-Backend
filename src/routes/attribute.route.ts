import { Elysia } from "elysia";
import { createAttribute, getAttributeByValue, deleteAttributeByValue, updateAttribute } from "@src/controllers/attributeController/attribute.controller";
import { attributeDTO, attributeParamsDTO, updateAttributeDTO } from "@src/dto/attribute.dto";

export const attributeRoutes = new Elysia().group("/attribute", (app) =>
  app.post("/create", createAttribute, {
    body: attributeDTO,
    detail: {
      summary: "Create a new attribute",
      tags: ["Attribute"],
    },
  })
  .get("/get/:value", getAttributeByValue, {
    params: attributeParamsDTO,
    detail: {
      summary: "Get an attribute by value",
      tags: ["Attribute"],
    },
  })
  .delete("/delete/:value", deleteAttributeByValue, {
    params: attributeParamsDTO,
    detail: {
      summary: "Delete an attribute by value",
      tags: ["Attribute"],
    },
  })
  .put("/update", updateAttribute, {
    body: updateAttributeDTO,
    detail: {
      summary: "Update an attribute",
      tags: ["Attribute"],
    },
  }),

);
