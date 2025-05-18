import { Elysia } from "elysia";
import {
  createAssetAttribute,
  getAssetAttributeByAssetName,
  getAssetAttributesByEventId,
  deleteAssetAttributeByNameVersion,
  updateAssetAttributeById,
} from "@src/controllers/assetAttributeController/asset_attribute.controller";
import {
  assetAttributeDTO,
  get_by_name,
  get_by_event_id,
  delete_by_name_version,
  update_by_id,
} from "@src/dto/asset_attribute.dto";

export const assetAttributeRoutes = new Elysia().group(
  "/asset-attribute",
  (app) =>
    app
      .post("/create", createAssetAttribute, {
        body: assetAttributeDTO,
        detail: {
          summary: "Create a new asset attribute",
          tags: ["Asset Attribute"],
        },
      })
      .get("/get-by-event-id/:event_id", getAssetAttributesByEventId, {
        params: get_by_event_id,
        detail: {
          summary: "Get asset attributes by event ID",
          tags: ["Asset Attribute"],
        },
      })
      .get("/get-by-name/:asset_name", getAssetAttributeByAssetName, {
        params: get_by_name,
        detail: {
          summary: "Get asset attribute by asset name",
          tags: ["Asset Attribute"],
        },
      })
      .delete("/delete-by-name-version", deleteAssetAttributeByNameVersion, {
        body: delete_by_name_version,
        detail: {
          summary: "Delete asset attribute by name and version",
          tags: ["Asset Attribute"],
        },
      })
      .put("/update-by-id", updateAssetAttributeById, {
        body: update_by_id,
        detail: {
          summary: "Update asset attribute by ID",
          tags: ["Asset Attribute"],
        },
      })
);
