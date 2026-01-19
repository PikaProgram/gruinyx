import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schemas";
import { env } from '@env';

export const dbClient = drizzle(
  env.DATABASE_URL,
  { 
    schema
  }
);