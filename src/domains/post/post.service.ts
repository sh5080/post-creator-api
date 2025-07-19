import { buildGeminiPrompt } from "@common/utils/promptBuilder.util";
import { generateBlogPostWithGemini } from "@gemini/gemini.service";
import { ImageData } from "@common/types/image.type";
import {
  CreatePostDto,
  CreateTemplateDto,
  GetPublicTemplatesDto,
  GetMyTemplatesDto,
  GetMyFavoriteTemplatesDto,
} from "./dto/post.dto";
import { PostRepository } from "./post.repository";
import { Injectable } from "@nestjs/common";
import { createPaginationResponse } from "@common/utils/pagination.util";

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async createPost(
    userId: string,
    dto: CreatePostDto,
    imageDataArray: ImageData[]
  ) {
    // 3. Gemini API 프롬프트 구성
    const promptParts = buildGeminiPrompt(
      dto.clientRequestPrompt,
      dto.keywords,
      dto.keywordCount,
      imageDataArray
    );

    // 4. Gemini API 호출
    const generatedBlogPost = await generateBlogPostWithGemini(promptParts);

    return await this.postRepository.createPost({
      title: dto.title,
      content: generatedBlogPost,
      category: dto.postCategory,
      authorId: userId,
    });
  }

  async getPostsByUserId(userId: string) {
    return await this.postRepository.findByUserId(userId);
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
}
