import { dropAllTables } from "./client";

async function dropTables() {
  try {
    console.log("🛑 Dropping all tables...");
    
    // Calling the drop function
    await dropAllTables();

    console.log("✅ Drop all tables complete!");
  } catch (error) {
    console.error("❌ Error during table drop:", error);
  }
}

// Execute dropTables function
dropTables();

