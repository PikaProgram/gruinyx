import { createId } from "@paralleldrive/cuid2";
import { json, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";

export const roleEnum = pgEnum('role_name', ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'GUEST']);

export const roleTable = pgTable(
  'roles',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    roleName: roleEnum()
      .default('GUEST')
      .notNull(),
    permissions: json().$type<string[]>()
      .default([])
      .notNull(),
    description: varchar('description'),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
);

export const userRoleTable = pgTable(
  'user_roles',
  {
    userId: varchar('user_id')
      .notNull()
      .references(() => userTable.id),
    roleId: varchar('role_id')
      .notNull()
      .references(() => roleTable.id),
    assignedAt: timestamp('assigned_at')
      .defaultNow()
      .notNull(),
  },
);

