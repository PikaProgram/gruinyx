import { t } from 'elysia';
import { createEnv } from "@jcwillox/typebox-x";

export const env = createEnv(
  t.Object({
    NODE_ENV: t.String({ default: "development" }),
    SERVER_PORT: t.Number({ default: 3000 }),
    DATABASE_URL: t.String(),
  }),
);