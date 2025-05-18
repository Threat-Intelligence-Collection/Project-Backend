import { t } from "elysia";

export const assetAttributeDTO = t.Object({
  event_id: t.Number(),
  asset_name: t.String({ minLength: 1 }),
  version: t.String({ minLength: 1 }),
  vendor: t.String({ minLength: 1 }),
  cpe: t.String({ minLength: 1 }),
  source: t.String({ minLength: 1 }),
  exp: t.Date({ format: "date-time" }),
});

export const get_by_name = t.Object({
  asset_name: t.String({ minLength: 1 }),
});

export const get_by_event_id = t.Object({
  event_id: t.Number(),
});

export const delete_by_name_version = t.Object({
  asset_name: t.String({ minLength: 1 }),
  version: t.String({ minLength: 1 }),
});

export const update_by_id = t.Object({
  id: t.Number(), // required
  event_id: t.Optional(t.Number()),
  asset_name: t.Optional(t.String({ minLength: 1 })),
  version: t.Optional(t.String({ minLength: 1 })),
  vendor: t.Optional(t.String({ minLength: 1 })),
  cpe: t.Optional(t.String({ minLength: 1 })),
  source: t.Optional(t.String({ minLength: 1 })),
  exp: t.Optional(t.Date({ format: "date-time" })),
});
