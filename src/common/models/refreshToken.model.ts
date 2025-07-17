import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { User } from "./user.model";

export const RefreshToken = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => User.id),
  token: varchar("token", { length: 255 }).unique(),
  expiresAt: timestamp("expires_at"),
  isRevoked: boolean("is_revoked").default(false),
});
