import { t } from "elysia";

export const tagDTO = t.Object({
  tag_name: t.String({ minLength: 1 }),
  color: t.String({ minLength: 1 }),
  event_id: t.Number({ minimum: 1 }),
});

export const eventTagDTO = t.Object({
  tag_name: t.String({ minLength: 1 }),
  event_id: t.Number({ minimum: 1 }),
});

export const eventIDparams = t.Object({
  event_id: t.Number({ minimum: 1 }),
});
