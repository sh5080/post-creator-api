import { buildPostPrompt } from "@common/utils/promptBuilder.util";
import { generateBlogPostWithGemini } from "@gemini/gemini.service";
import { ImageData } from "@common/types/image.type";
import {
  CreatePostDto,
  CreateTemplateDto,
  GetPublicTemplatesDto,
  GetMyTemplatesDto,
  GetMyFavoriteTemplatesDto,
  GetMyPostsDto,
  DeletePostDto,
} from "./dto/post.dto";
import { PostRepository } from "./post.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { createPaginationResponse } from "@common/utils/pagination.util";
import { PostTemplate } from "@common/models/postTemplate.model";
import { Part } from "@google/generative-ai";

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async createPost(
    userId: string,
    dto: CreatePostDto,
    imageDataArray: ImageData[]
  ) {
    let promptParts: Part[];
    let template: typeof PostTemplate.$inferSelect | undefined = undefined;
    // 1. 템플릿 조회
    if (dto.templateId) {
      template = await this.postRepository.findTemplateById(dto.templateId);
      if (!template || template.authorId !== userId) {
        throw new NotFoundException("템플릿이 존재하지 않습니다.");
      }
    }
    // 2. Gemini API 프롬프트 구성
    promptParts = buildPostPrompt(dto, imageDataArray, template);

    // 3. Gemini API 호출
    const generatedBlogPost = await generateBlogPostWithGemini(promptParts);
    // 4. 포스트 생성
    return await this.postRepository.createPost({
      title: dto.title,
      content: generatedBlogPost,
      category: dto.category,
      authorId: userId,
    });
  }

  async getPostsByUserId(userId: string, dto: GetMyPostsDto) {
    const posts = await this.postRepository.findByUserId(userId, dto);
    return createPaginationResponse(posts, dto);
  }

  async deletePost(userId: string, dto: DeletePostDto) {
    const deletedPost = await this.postRepository.deletePost(userId, dto);
    if (deletedPost.rowCount === 0) {
      throw new NotFoundException("삭제할 포스트가 존재하지 않습니다.");
    }
    return;
  }

  //    ------------- template -------------

  async createTemplate(userId: string, dto: CreateTemplateDto) {
    return await this.postRepository.createTemplate(userId, dto);
  }

  async getPublicTemplates(dto: GetPublicTemplatesDto) {
    const templates = await this.postRepository.findPublicTemplates(dto);
    return createPaginationResponse(templates, dto);
  }

  // 내가 생성한 템플릿 조회
  async getMyTemplates(userId: string, dto: GetMyTemplatesDto) {
    const templates = await this.postRepository.findTemplatesByUserId(
      userId,
      dto
    );
    return createPaginationResponse(templates, dto);
  }

  // 즐겨찾기한 템플릿 조회
  async getFavoriteTemplates(userId: string, dto: GetMyFavoriteTemplatesDto) {
    const templates = await this.postRepository.findFavoriteTemplatesById(
      userId,
      dto
    );
    return createPaginationResponse(templates, dto);
  }

  async deleteTemplate(userId: string, id: string) {
    const deletedTemplate = await this.postRepository.deleteTemplate(
      userId,
      id
    );
    if (deletedTemplate.rowCount === 0) {
      throw new NotFoundException("삭제할 템플릿이 존재하지 않습니다.");
    }
    return deletedTemplate;
  }
}
