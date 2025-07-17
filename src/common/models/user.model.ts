import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  nickname: varchar("nickname", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
