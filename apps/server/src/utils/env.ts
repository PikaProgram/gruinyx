import { t } from 'elysia';

export const env = t.Object({
  NODE_ENV: t.Enum({ development: 'development', production: 'production' }, {default: 'development'}),
  SERVER_PORT: t.Number(),
  DATABASE_URL: t.String(),
  JWT_SECRET: t.String()
});

export type envSchema = {
  NODE_ENV: 'development' | 'production';
  SERVER_PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

