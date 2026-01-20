import { createId } from "@paralleldrive/cuid2";
import { pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";
import { moduleTable } from "@/database/schemas";

export const lessonTypeEnum = pgEnum('lesson_type', ['VIDEO', 'ARTICLE', 'PRESENTATION', 'QUIZ', 'ASSIGNMENT']);

export const lessonTable = pgTable(
  'lessons',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    moduleId: varchar('module_id')
      .notNull()
      .references(() => moduleTable.id),
    title: varchar('title')
      .notNull(),
    type: lessonTypeEnum()
      .notNull(),
    contentUrl: varchar('content_url'),
  },
);

export const lessonAssetsTable = pgTable(
  'lesson_assets',
  {
    id: varchar('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    lessonId: varchar('lesson_id')
      .notNull()
      .references(() => lessonTable.id),
    assetUrl: varchar('asset_url')
      .notNull(),
  },
);