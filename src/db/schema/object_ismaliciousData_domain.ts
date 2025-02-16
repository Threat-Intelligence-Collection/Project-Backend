import { pgTable, text, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_ismaliciousData_domain = pgTable(
  "object_ismaliciousData_domain",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity()
      .references(() => objects.id, { onDelete: "cascade" }),
    malicious_score: integer("malicious_score"),
    suspicious_score: integer("suspicious_score"),
    undetected_score: integer("undetected_score"),
    harmless_score: integer("harmless_score"),
    ip: varchar("ip", { length: 255 }),
    datacenter: varchar("datacenter", { length: 255 }),
    network: varchar("network", { length: 255 }),
  }
);
