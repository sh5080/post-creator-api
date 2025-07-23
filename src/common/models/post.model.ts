import { pgTable, varchar, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { User } from "./user.model";

export const POST_CATEGORY = {
  TECH: "tech",
  LIFE: "life",
  TRAVEL: "travel",
  FOOD: "food",
  FASHION: "fashion",
} as const;

export const Post = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  authorId: uuid("author_id").references(() => User.id),
  category: varchar("category", { length: 255 })
    .$type<(typeof POST_CATEGORY)[keyof typeof POST_CATEGORY]>()
    .notNull(),
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
