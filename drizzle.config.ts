import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './libs/database/src/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql', 
  dbCredentials: {
    url: 'postgresql://eventflowapp:eventflow_password@localhost:5433/eventflowapp?schema=public',
    // url: 'postgresql://neondb_owner:npg_OUA7Rij3YotX@ep-falling-cake-a142d4m7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
});