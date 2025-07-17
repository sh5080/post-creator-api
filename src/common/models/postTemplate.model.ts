import {
  pgTable,
  varchar,
  boolean,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { POST_CATEGORY } from "./post.model";
import { User } from "./user.model";
export const PostTemplate = pgTable("post_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => User.id),
  name: varchar("name", { length: 255 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  category: varchar("category", { length: 100 }).$type<
    (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY]
  >(),
  isPublic: boolean("is_public").default(true),
  favoriteCount: integer("favorite_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
