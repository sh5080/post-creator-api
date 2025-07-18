import { db } from "@common/configs/database.config";
import { Post, POST_CATEGORY } from "@common/models/post.model";
import { PostTemplate } from "@common/models/postTemplate.model";
import { and, eq, desc } from "drizzle-orm";
import { CreateTemplateDto, GetPublicTemplatesDto } from "./dto/post.dto";
import { TemplateFavorite } from "@common/models/templateFavorite.model";

export class PostRepository {
  async findById(postId: string) {
    return (await db.select().from(Post).where(eq(Post.id, postId)))[0];
  }

  async findByUserId(userId: string) {
    return await db.select().from(Post).where(eq(Post.authorId, userId));
  }

  async createPost(dto: {
    title: string;
    content: string;
    category: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];
    authorId: string;
  }) {
    return (await db.insert(Post).values(dto).returning())[0];
  }

  async createTemplate(userId: string, dto: CreateTemplateDto) {
    console.log("dto:::@:@:@:@:@: ", dto);
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
      .select()
      .from(PostTemplate)
      .where(and(...conditions));

    if (sort === "latest") {
      query.orderBy(desc(PostTemplate.createdAt));
    }

    return await query;
  }

  async findTemplatesByUserId(userId: string) {
    return await db
      .select()
      .from(PostTemplate)
      .where(eq(PostTemplate.authorId, userId));
  }

  async findFavoriteTemplatesById(userId: string) {
    return await db
      .select()
      .from(TemplateFavorite)
      .where(eq(TemplateFavorite.userId, userId));
  }
}
