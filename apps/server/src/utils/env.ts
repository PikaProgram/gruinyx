import { t } from 'elysia';
import { createEnv } from "@jcwillox/typebox-x";

export const env = createEnv(
  t.Object({
    NODE_ENV: t.String({ default: "development" }),
    SERVER_PORT: t.Number({ default: 3030 }),
    DATABASE_URL: t.String(),
    JWT_ACCESS_SECRET: t.String({ default: "access" }),
    JWT_REFRESH_SECRET: t.String({ default: "refresh" }),
    ACCESS_TOKEN_EXPIRY: t.String({ default: "15m" }),
    REFRESH_TOKEN_EXPIRY: t.String({ default: "7d" }),
  }),
);