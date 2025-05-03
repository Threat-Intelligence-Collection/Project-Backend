import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { connectionString } from "./util";

const dbConn = postgres(connectionString, { max: 1 });

async function main() {
  await migrate(drizzle(dbConn), {
    migrationsFolder: "./db/migration",
    migrationsSchema: "drizzle",
  });
  await dbConn.end();
}

main();