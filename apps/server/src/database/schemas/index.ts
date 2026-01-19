import { courseEnrollmentTable, courseStatusEnum, courseTable, moduleTable } from './course/course.schema';
import { lessonTable } from './course/lesson.schema';
import { roleEnum, roleTable, userRoleTable } from './identity/role.schema';
import { userTable } from './identity/user.schema';

export * from './identity/user.schema';
export * from './identity/role.schema';
export * from './course/course.schema';
export * from './course/lesson.schema';

export const table = {
  userTable,
  roleTable,
  userRoleTable,
  courseTable,
  moduleTable,
  lessonTable,
  courseEnrollmentTable,
  courseStatusEnum,
  roleEnum,
} as const;

export type Table = typeof table;