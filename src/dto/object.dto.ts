import { t } from "elysia";

export const objectDTO = t.Object({
  event_id: t.Number({ minimum: 1 }),
  object_name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
});

export const eventIDParamsDTO = t.Object({
  event_id: t.Number({ minimum: 1 }),
});

export const objectIDParamsDTO = t.Object({
  id: t.Number({ minimum: 1 }),
});

export const updateObjectDTO = t.Object({
  id: t.Number({ minimum: 1 }),
  event_id: t.Number({ minimum: 1 }),
  object_name: t.Optional(t.String()),
  description: t.Optional(t.String()),
});
