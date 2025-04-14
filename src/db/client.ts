import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { connectionString } from "./util";
import { sql } from "drizzle-orm";
import { users } from "./schema/user";
import { asset_attributes } from "./schema/asset_attributes";
import { attributes } from "./schema/attributes";
import { cve_data } from "./schema/cve_data";
import { event_tags } from "./schema/event_tags";
import { events } from "./schema/events";
import { locations } from "./schema/locations";
import { object_abuseipdb_ip } from "./schema/object_abuseipdb_ip";
import { object_criminalip_domain } from "./schema/object_criminalip_domain";
import { object_criminals_ip } from "./schema/object_criminals_ip";
import { object_virustotal_domain } from "./schema/object_virustotal_domain";
import { object_dbip_ip } from "./schema/object_dbip_ip";
import { object_virustotal_ip } from "./schema/object_virustotal_ip";
import { objects } from "./schema/objects";
import { tags } from "./schema/tags";
import { object_urlvoidData_domain } from "./schema/object_urlvoidData_domain";
import { object_neutrinoData_domain } from "./schema/object_neutrinoData_doamin";
import { object_blocklist_ip } from "./schema/object_blocklist_ip";
import { object_ismaliciousData_domain } from "./schema/object_ismaliciousData_domain";

const dbConn = postgres(connectionString);
const dbClient = drizzle(dbConn, {
  schema: {
    users,
    asset_attributes,
    attributes,
    cve_data,
    event_tags,
    events,
    locations,
    object_abuseipdb_ip,
    object_criminalip_domain,
    object_criminals_ip,
    object_dbip_ip,
    object_virustotal_domain,
    object_urlvoidData_domain,
    object_neutrinoData_domain,
    object_ismaliciousData_domain,
    object_blocklist_ip,
    object_virustotal_ip,
    objects,
    tags,
  },
  logger: false,
});

async function dropAllTables() {
  try {
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

// dropAllTables();
