import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@env';

export default defineConfig({
  out: './.drizzle',
  schema: './src/database/schemas/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
