import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { connectionString } from "@db/util";

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString!,
  },
  verbose: true,
  strict: true,
});
