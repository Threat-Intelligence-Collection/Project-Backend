import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { attributes } from "./attributes";

export const locations = pgTable("locations", {
  id: integer("id").generatedAlwaysAsIdentity(),
  att_value: varchar("att_value", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => attributes.value, { onDelete: "cascade" }),
  country: varchar("country", { length: 255 }),
  region: varchar("region", { length: 255 }),
  city: varchar("city", { length: 255 }),
  latitude: varchar("latitude", { length: 255 }),
  longtitude: varchar("longtitude", { length: 255 }),
  isp: varchar("isp", { length: 255 }),
  asn: varchar("asn", { length: 255 }),
});