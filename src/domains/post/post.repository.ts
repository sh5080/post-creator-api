import { db } from "@common/configs/database.config";
import { Post, POST_CATEGORY } from "@common/models/post.model";
import { PostTemplate } from "@common/models/postTemplate.model";
import { User } from "@common/models/user.model";
import { and, eq, desc, like } from "drizzle-orm";
import {
  CreateTemplateDto,
  DeletePostDto,
  GetMyPostsDto,
  GetMyTemplatesDto,
  GetPublicTemplatesDto,
} from "./dto/post.dto";
import { TemplateFavorite } from "@common/models/templateFavorite.model";
import { postTemplateQuery } from "./post.query";

export class PostRepository {
  async findById(postId: string) {
    return (await db.select().from(Post).where(eq(Post.id, postId)))[0];
  }

  async findByUserId(userId: string, dto?: GetMyPostsDto) {
    const conditions = [eq(Post.authorId, userId)];

    return await db
      .select()
      .from(Post)
      .where(and(...conditions));
  }

  async createPost(dto: {
    title: string;
    content: string;
    category: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];
    authorId: string;
    imageUrls: string[];
  }) {
    return (await db.insert(Post).values(dto).returning())[0];
  }

  async deletePost(userId: string, dto: DeletePostDto) {
    return await db
      .delete(Post)
      .where(and(eq(Post.id, dto.id), eq(Post.authorId, userId)));
  }

  // ------------------- Template -------------------

  async createTemplate(userId: string, dto: CreateTemplateDto) {
    return (
      await db
        .insert(PostTemplate)
        .values({ ...dto, authorId: userId })
        .returning()
    )[0];
  }

  async findPublicTemplates(dto: GetPublicTemplatesDto) {
    const { category, sort } = dto;

    let conditions = [eq(PostTemplate.isPublic, true)];

    if (category) {
      conditions.push(eq(PostTemplate.category, category));
    }

    const query = db
      .select(postTemplateQuery.selectTemplates)
      .from(PostTemplate)
      .innerJoin(User, eq(PostTemplate.authorId, User.id))
      .where(and(...conditions));

    if (sort === "latest") {
      query.orderBy(desc(PostTemplate.createdAt));
    }

    return await query;
  }
  async findTemplateById(id: string) {
    return (
      await db.select().from(PostTemplate).where(eq(PostTemplate.id, id))
    )[0];
  }
  async findTemplatesByUserId(userId: string, dto?: GetMyTemplatesDto) {
    const conditions = [eq(PostTemplate.authorId, userId)];
    if (dto?.name) {
      conditions.push(like(PostTemplate.name, `%${dto.name}%`));
    }

    let query = db
      .select(postTemplateQuery.selectTemplates)
      .from(PostTemplate)
      .innerJoin(User, eq(PostTemplate.authorId, User.id))
      .where(and(...conditions));

    if (dto?.sort === "latest") {
      query.orderBy(desc(PostTemplate.createdAt));
    }

    return await query;
  }

  async findFavoriteTemplatesById(userId: string, dto?: { sort?: string }) {
    const query = db
      .select(postTemplateQuery.selectTemplates)
      .from(TemplateFavorite)
      .innerJoin(PostTemplate, eq(TemplateFavorite.templateId, PostTemplate.id))
      .innerJoin(User, eq(PostTemplate.authorId, User.id))
      .where(eq(TemplateFavorite.userId, userId));

    if (dto?.sort === "latest") {
      return await query.orderBy(desc(PostTemplate.createdAt));
    }

    return await query;
  }

  async deleteTemplate(userId: string, id: string) {
    return await db
      .delete(PostTemplate)
      .where(and(eq(PostTemplate.id, id), eq(PostTemplate.authorId, userId)));
  }
}
