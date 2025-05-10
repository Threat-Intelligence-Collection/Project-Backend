import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { connectionString } from "./util";
import { sql } from "drizzle-orm";
import { users, userRelations, userTypeEnum } from "./schema/user";
import {
  asset_attributes,
  asset_attributesRelations,
} from "./schema/asset_attributes";
import { attributes, attributesRelations, attributeTypeEnum } from "./schema/attributes";
import { cve_data, cve_dataRelations } from "./schema/cve_data";
import { event_tags, event_tagsRelations } from "./schema/event_tags";
import { events, eventsRelations } from "./schema/events";
import { locations, locationsRelations } from "./schema/locations";
import {
  object_abuseipdb_ip,
  abuseipdb_ipRelations,
} from "./schema/object_abuseipdb_ip";
import {
  object_criminalip_domain,
  criminalip_domainRelations,
} from "./schema/object_criminalip_domain";
import {
  object_criminals_ip,
  criminals_ipRelations,
} from "./schema/object_criminals_ip";
import {
  object_virustotal_domain,
  virustotal_domainRelations,
} from "./schema/object_virustotal_domain";
import { object_dbip_ip, dbip_ipRelations } from "./schema/object_dbip_ip";
import {
  object_virustotal_ip,
  virustotal_ipRelations,
} from "./schema/object_virustotal_ip";
import { objects, objectsRelations } from "./schema/objects";
import { tags, tagsRelations } from "./schema/tags";
import {
  object_urlvoidData_domain,
  urlvoidData_domainRelations,
} from "./schema/object_urlvoidData_domain";
import {
  object_neutrinoData_domain,
  neutrinoData_domainRelations,
} from "./schema/object_neutrinoData_doamin";
import {
  object_blocklist_ip,
  blocklist_ipRelations,
} from "./schema/object_blocklist_ip";
import {
  object_ismaliciousData_domain,
  ismaliciousData_domainRelations,
} from "./schema/object_ismaliciousData_domain";

const dbConn = postgres(connectionString);
const dbClient = drizzle(dbConn, {
  schema: {
    users,
    userRelations,
    asset_attributes,
    asset_attributesRelations,
    attributes,
    attributesRelations,
    cve_data,
    cve_dataRelations,
    event_tags,
    event_tagsRelations,
    events,
    eventsRelations,
    locations,
    locationsRelations,
    object_abuseipdb_ip,
    abuseipdb_ipRelations,
    object_criminalip_domain,
    criminalip_domainRelations,
    object_criminals_ip,
    criminals_ipRelations,
    object_dbip_ip,
    dbip_ipRelations,
    object_virustotal_domain,
    virustotal_domainRelations,
    object_urlvoidData_domain,
    urlvoidData_domainRelations,
    object_neutrinoData_domain,
    neutrinoData_domainRelations,
    object_ismaliciousData_domain,
    ismaliciousData_domainRelations,
    object_blocklist_ip,
    blocklist_ipRelations,
    object_virustotal_ip,
    virustotal_ipRelations,
    objects,
    objectsRelations,
    tags,
    tagsRelations,
  },
  logger: false,
});

async function dropAllTables() {
  try {
    await dbClient.execute(sql`DROP TYPE IF EXISTS ${attributeTypeEnum}`);
    await dbClient.execute(sql`DROP TYPE IF EXISTS ${userTypeEnum}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${cve_data}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${locations}`);
    await dbClient.execute(
      sql`DROP TABLE IF EXISTS ${object_virustotal_domain}`
    );
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${object_abuseipdb_ip}`);
    await dbClient.execute(
      sql`DROP TABLE IF EXISTS ${object_criminalip_domain}`
    );
    await dbClient.execute(
      sql`DROP TABLE IF EXISTS ${object_urlvoidData_domain}`
    );
    await dbClient.execute(
      sql`DROP TABLE IF EXISTS ${object_neutrinoData_domain}`
    );
    await dbClient.execute(
      sql`DROP TABLE IF EXISTS ${object_ismaliciousData_domain}`
    );
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${object_blocklist_ip}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${object_criminals_ip}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${object_dbip_ip}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${object_virustotal_ip}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${objects}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${asset_attributes}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${attributes}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${event_tags}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${tags}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${events}`);
    await dbClient.execute(sql`DROP TABLE IF EXISTS ${users}`);
  } catch (err) {
    console.error(err);
  } finally {
    await dbConn.end();
  }
}

export { dbConn, dbClient, dropAllTables };

