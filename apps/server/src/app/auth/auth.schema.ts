import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { table } from "../../database/schemas";
import { t, type Static } from "elysia";

const _createUser = createInsertSchema(table.userTable, {
  email: t.String({ format: 'email' }),
});

const _selectUser = createSelectSchema(table.userTable, {
  id: t.Optional(t.String()),
  email: t.Optional(t.String({ format: 'email' })),
  username: t.Optional(t.String()),
});

export const createUserBodySchema = t.Omit(_createUser, ['id', 'createdAt']);
export type CreateUserBody = Static<typeof createUserBodySchema>;

export const selectUserParamsSchema = t.Omit(_selectUser, ['password', 'createdAt']);
export type SelectUserParams = Static<typeof selectUserParamsSchema>;