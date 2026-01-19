import {
  pgTable,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

import { createId } from '@paralleldrive/cuid2';

export const userTable = pgTable(
  'users',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    username: varchar('username')
      .notNull()
      .unique(),
    password: varchar('password')
      .notNull(),
    email: varchar('email')
      .notNull()
      .unique(),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  }, (table) => [
    index('users_username_index').on(table.username),
    index('users_created_at_index').on(table.createdAt),
  ]
);