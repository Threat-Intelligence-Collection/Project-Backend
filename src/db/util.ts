import { Pool } from "pg";
import "dotenv/config";

const dbUser = process.env.POSTGRES_APP_USER;
const dbPassword = process.env.POSTGRES_APP_PASSWORD;
const dbHost = process.env.POSTGRES_HOST;
const dbPort = process.env.POSTGRES_PORT;
const dbName = process.env.POSTGRES_DB;

if (!dbUser || !dbPassword || !dbHost || !dbName || !dbName) {
  throw new Error("Invalid DB env.");
}

export const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const pool = new Pool({
  connectionString,
});

/**
 * Connects to the PostgreSQL database.
 * @returns {Promise<void>} Resolves if the connection is successful; rejects otherwise.
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect(); // Test the connection
    console.log("✅ Successfully connected to the database!");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error(
      "❌ Failed to connect to the database. Please check your connection settings."
    );
    throw error; // Propagate the error to stop the server initialization
  }
};
