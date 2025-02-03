import { pgTable, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_criminals_ip = pgTable("object_criminals_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  inbound_score: integer("inbound_score"),
  ontbound_score: integer("ontbound_score"),
  last_report: timestamp("last_report", { withTimezone: true }),
});