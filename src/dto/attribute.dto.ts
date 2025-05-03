import { t } from "elysia";

export type AttributeType = "ip" | "domain";

const ipv4OrDomainRegex =
  /^(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

export const attributeDTO = t.Object({
  event_id: t.Number(),
  type: t.Enum({ ip: "ip", domain: "domain" }),
  value: t.String({
    minLength: 1,
    pattern: ipv4OrDomainRegex.source,
    error: "value must be a valid IPv4 address or domain name"
  }),
  firstseen: t.Date({ format: "date-time" }),
  lastseen: t.Date({ format: "date-time" }),
});

export const attributeParamsDTO = t.Object({
  value: t.String({
    minLength: 1,
    pattern: ipv4OrDomainRegex.source,
    error: "value must be a valid IPv4 address or domain name"
  }),
});

export const updateAttributeDTO = t.Object({
  value: t.String({
    minLength: 1,
    pattern: ipv4OrDomainRegex.source,
    error: "value must be a valid IPv4 address or domain name"
  }),
  event_id: t.Number(),
  type: t.Nullable(t.Optional(t.String())),
  firstseen: t.Nullable(t.Optional(t.Date())),
  lastseen: t.Nullable(t.Optional(t.Date())),
});