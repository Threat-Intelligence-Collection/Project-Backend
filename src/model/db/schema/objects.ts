import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { events } from "./events";
import { relations } from "drizzle-orm";
import { object_abuseipdb_ip } from "./object_abuseipdb_ip";
import { object_blocklist_ip } from "./object_blocklist_ip";
import { object_criminalip_domain } from "./object_criminalip_domain";
import { object_criminals_ip } from "./object_criminals_ip";
import { object_dbip_ip } from "./object_dbip_ip";
import { object_ismaliciousData_domain } from "./object_ismaliciousData_domain";
import { object_neutrinoData_domain } from "./object_neutrinoData_doamin";
import { object_urlvoidData_domain } from "./object_urlvoidData_domain";
import { object_virustotal_domain } from "./object_virustotal_domain";
import { object_virustotal_ip } from "./object_virustotal_ip";


export const objects = pgTable("objects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  object_name: varchar("object_name", { length: 255 }),
  description: varchar("description", { length: 255 }),
});

export const objectsRelations = relations(objects, ({ one }) => ({
        abuseipdb_ip: one(object_abuseipdb_ip, {
            fields: [objects.id],
            references: [object_abuseipdb_ip.id],
        }),
        blocklist_ip: one(object_blocklist_ip, {
            fields: [objects.id],
            references: [object_blocklist_ip.id],
        }),
        criminalip_domain: one(object_criminalip_domain, {
            fields: [objects.id],
            references: [object_criminalip_domain.id],
        }),
        criminals_ip: one(object_criminals_ip, {
            fields: [objects.id],
            references: [object_criminals_ip.id],
        }),
        dbip_ip: one(object_dbip_ip, {
            fields: [objects.id],
            references: [object_dbip_ip.id],
        }),
        ismaliciousData_domain: one(object_ismaliciousData_domain, {
            fields: [objects.id],
            references: [object_ismaliciousData_domain.id],
        }),
        neutrinoData_domain: one(object_neutrinoData_domain, {
            fields: [objects.id],
            references: [object_neutrinoData_domain.id],
        }),
        urlvoidData_domain: one(object_urlvoidData_domain, {
            fields: [objects.id],
            references: [object_urlvoidData_domain.id],
        }),
        virustotal_domain: one(object_virustotal_domain, {
            fields: [objects.id],
            references: [object_virustotal_domain.id],
        }),
        virustotal_ip: one(object_virustotal_ip, {
            fields: [objects.id],
            references: [object_virustotal_ip.id],
        }),
        event: one(events, {
            fields: [objects.event_id],
            references: [events.id],
        }),
    }));