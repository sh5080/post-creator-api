import { buildGeminiPrompt } from "@common/utils/promptBuilder.util";
import { generateBlogPostWithGemini } from "@gemini/gemini.service";
import { ImageData } from "@common/types/image.type";
import {
  CreatePostDto,
  CreateTemplateDto,
  GetPublicTemplatesDto,
} from "./dto/post.dto";
import { PostRepository } from "./post.repository";
import { Injectable } from "@nestjs/common";

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

    const { page = 1, limit = 10 } = dto;
    return {
      items: templates,
      pagination: {
        total: templates.length,
        page,
        totalPages: Math.ceil(templates.length / limit),
      },
    };
  }

  // 내가 생성한 템플릿 조회
  async getTemplatesByCreator(userId: string) {
    return await this.postRepository.findTemplatesByUserId(userId);
  }

  // 즐겨찾기한 템플릿 조회
  async getFavoriteTemplates(userId: string) {
    const user = await this.postRepository.findFavoriteTemplatesById(userId);
    return user;
  }
}
