import { pgTable, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_virustotal_domain = pgTable("object_virustotal_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  malicious_score: integer("malicious_score"),
  suspicious_score: integer("suspicious_score"),
  undetected_score: integer("undetected_score"),
  harmless_score: integer("harmless_score"),
});