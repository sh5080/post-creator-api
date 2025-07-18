import { db } from "@common/configs/database.config";
import { User } from "@common/models/user.model";
import { eq } from "drizzle-orm";
import {
  CreateUserDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
} from "./dto/user.dto";

export class UserRepository {
  async findById(userId: string) {
    return (await db.select().from(User).where(eq(User.id, userId)))[0];
  }
  async findByEmail(email: string) {
    return (await db.select().from(User).where(eq(User.email, email)))[0];
  }

  async createUser(dto: CreateUserDto) {
    return (await db.insert(User).values(dto).returning())[0];
  }

  async updateNickname(userId: string, dto: UpdateNicknameDto) {
    return (
      await db
        .update(User)
        .set({ nickname: dto.nickname })
        .where(eq(User.id, userId))
        .returning()
    )[0];
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    return (
      await db
        .update(User)
        .set({ password: dto.password })
        .where(eq(User.id, userId))
        .returning()
    )[0];
  }

  async deleteUser(userId: string) {
    return await db.delete(User).where(eq(User.id, userId));
  }
}
