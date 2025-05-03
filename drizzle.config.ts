import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { connectionString } from "@src/model/db/util";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/model/db/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString!,
  },
  verbose: true,
  strict: true,
});
