import { t } from "elysia";

export const eventDTO = t.Object({
  info: t.Optional(t.String()),
  user_id: t.Number({ minimum: 1 }),
  mitigration: t.Optional(t.String()),
  threat_level_id: t.Number({ minimum: 0, maximum: 10 }),
});

export const updateEventDTO = t.Object({
    id: t.Number({ minimum: 1 }),
    info: t.Optional(t.String()),
    user_id: t.Optional(t.Number({ minimum: 1 })),
    mitigration: t.Optional(t.String()),
    threat_level_id: t.Optional(t.Number({ minimum: 0, maximum: 10 })),
});

export const eventParamsDTO = t.Object({
  id: t.Number({ minimum: 1 }),
});
