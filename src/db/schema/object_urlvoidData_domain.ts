import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_urlvoidData_domain = pgTable("object_urlvoidData_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  detectionCounts: varchar("detectionCounts", { length: 255 }),
  lastAnalysis: varchar("lastAnalysis", { length: 255 }),
  domainRegisteration: varchar("domainRegisteration", { length: 255 }),
});