import { roleEnum, roleTable, userRoleTable } from './identity/role.schema';
import { userTable } from './identity/user.schema';

export * from './identity/user.schema';
export * from './identity/role.schema';

export const table = {
  userTable,
  roleTable,
  userRoleTable,
  roleEnum,
} as const;

export type Table = typeof table;