import { pgTable, uuid } from "drizzle-orm/pg-core";
import { User } from "./user.model";
import { PostTemplate } from "./postTemplate.model";

export const TemplateFavorite = pgTable("template_favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => User.id),
  templateId: uuid("template_id").references(() => PostTemplate.id),
});
