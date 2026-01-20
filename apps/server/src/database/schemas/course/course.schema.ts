import { createId } from "@paralleldrive/cuid2";
import { numeric, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { userTable } from "@/database/schemas";

export const courseStatusEnum = pgEnum('course_status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const courseTable = pgTable(
  'courses',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    instructorId: varchar('instructor_id')
      .notNull()
      .references(() => userTable.id),
    title: varchar('title')
      .notNull(),
    description: varchar('description'),
    thumbnailUrl: varchar('thumbnail_url'),
    price: numeric('price'),
    status: courseStatusEnum()
      .default('DRAFT')
      .notNull(),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
);

export const moduleTable = pgTable(
  'modules',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    courseId: varchar('course_id')
      .notNull()
      .references(() => courseTable.id),
    title: varchar('title')
      .notNull(),
    description: varchar('description'),
    order: numeric('order')
      .notNull(),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
);

export const courseEnrollmentTable = pgTable(
  'course_enrollments',
  {
    userId: varchar('user_id')
      .notNull()
      .references(() => userTable.id),
    courseId: varchar('course_id')
      .notNull()
      .references(() => courseTable.id),
    enrolledAt: timestamp('enrolled_at')
      .defaultNow()
      .notNull(),
  },
);