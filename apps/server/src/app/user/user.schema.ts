import { createInsertSchema } from "drizzle-typebox";
import { table } from "../../database/schemas";
import { t, type Static } from "elysia";

const _createUser = createInsertSchema(table.userTable, {
  email: t.String({ format: 'email' }),
});

export const createUserBodySchema = t.Omit(_createUser, ['id', 'createdAt']);
export type CreateUserBody = Static<typeof createUserBodySchema>;