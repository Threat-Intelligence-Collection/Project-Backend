import { dropAllTables } from "./client";
import { execSync } from "child_process";

async function reset() {
  console.log("Dropping all tables...");
  await dropAllTables();

  console.log("Rebuilding schema...");
  execSync("bunx drizzle-kit push", { stdio: "inherit" });

  console.log("✅ Reset complete!");
}

reset();
