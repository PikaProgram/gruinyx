import {
  pgTable,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

import { createId } from '@paralleldrive/cuid2';

export const user = pgTable(
  'user',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    username: varchar('username').notNull().unique(),
    password: varchar('password').notNull(),
    email: varchar('email').notNull().unique(),
    salt: varchar('salt', { length: 64 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  }, (table) => [
    index('user_username_index').on(table.username),
    index('user_created_at_index').on(table.createdAt),
  ]
);

export const table = {
  user
} as const;

export type Table = typeof table;