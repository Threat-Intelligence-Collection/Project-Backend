import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_criminalip_domain = pgTable("object_criminalip_domain", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  score: integer("score"),
  issue: text("issue").array(), 
});
