import { pgTable, text, integer, varchar,boolean } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_neutrinoData_domain = pgTable("object_neutrinoData_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  blocklist: text("blocklist").array(),
  is_malicious: boolean("is_malicious"),
  description: varchar("description", { length: 255 })
});

export const neutrinoData_domainRelations = relations(object_neutrinoData_domain, ({ one }) => ({
    object: one(objects, { 
        fields: [object_neutrinoData_domain.id],
        references: [objects.id],
    }),
}));