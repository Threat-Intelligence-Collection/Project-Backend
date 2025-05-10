import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { connectionString } from "./util";

const dbConn = postgres(connectionString, { max: 1 });

async function main() {
  try {
    console.log("🛠️  Starting migrations...");
    await migrate(drizzle(dbConn), {
      migrationsFolder: "drizzle",
    });
    console.log("✅ Migrations applied successfully.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await dbConn.end();
    console.log("🔌 Database connection closed.");
  }
}

main();
