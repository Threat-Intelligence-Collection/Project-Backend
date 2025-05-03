import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_criminalip_domain = pgTable("object_criminalip_domain", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  score: integer("score"),
  issue: text("issue").array(), 
});

export const criminalip_domainRelations = relations(object_criminalip_domain, ({ one }) => ({
    object: one(objects, {
        fields: [object_criminalip_domain.id],
        references: [objects.id],
    }),
}));
