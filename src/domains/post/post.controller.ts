import {
  CreatePostDto,
  createPostValidator,
  CreateTemplateDto,
  createTemplateValidator,
  GetPublicTemplatesDto,
  getPublicTemplatesValidator,
  GetMyTemplatesDto,
  getMyTemplatesValidator,
  GetMyFavoriteTemplatesDto,
  getMyFavoriteTemplatesValidator,
  deleteTemplateValidator,
  GetMyPostsDto,
  getMyPostsValidator,
  DeletePostDto,
  deletePostValidator,
} from "./dto/post.dto";
import { PostService } from "./post.service";
import { processImageBuffer } from "@common/utils/image.util";
import { ImageData } from "@common/types/image.type";
import { AuthRequest } from "@common/types/request.type";
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UploadedFiles,
  Req,
  BadRequestException,
  Query,
  Delete,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@common/guards/auth.guard";
import { ApiGuard } from "@common/guards/api.guard";
import { MultipartInterceptor } from "@common/interceptors/multipart.interceptor";
import { MultipartFile } from "@fastify/multipart";

@Controller("api/posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 블로그 포스트 생성
  @Post()
  @UseGuards(AuthGuard, ApiGuard)
  @UseInterceptors(MultipartInterceptor)
  async createPost(
    @Req() req: AuthRequest,
    @Body() body: CreatePostDto,
    @UploadedFiles() files: MultipartFile[]
  ) {
    try {
      body.keywords = JSON.parse(body.keywords as any);
      const dto = createPostValidator.validate(body);

      if (!files || files.length === 0) {
        throw new BadRequestException(
          "입력 유효성 검사 오류: 이미지가 제공되지 않았습니다."
        );
      }

      // 2. 업로드된 이미지를 Base64로 변환
      const imageDataArray: ImageData[] = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.toBuffer();
          return processImageBuffer(buffer, file.mimetype);
        })
      );

      const { userId } = req.user!;
      const generatedPost = await this.postService.createPost(
        userId,
        dto,
        imageDataArray
      );
      // 5. 결과 반환
      return {
        message: "블로그 포스트가 성공적으로 생성되었습니다.",
        post: generatedPost,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 내가 생성한 블로그 포스트 조회
  @Get("my")
  @UseGuards(AuthGuard)
  async getMyPosts(@Req() req: AuthRequest, @Query() query: GetMyPostsDto) {
    const { userId } = req.user!;
    const dto = getMyPostsValidator.validate(query);
    const posts = await this.postService.getPostsByUserId(userId, dto);
    return posts;
  }
  @Delete()
  @UseGuards(AuthGuard, ApiGuard)
  async deletePost(@Req() req: AuthRequest, @Body() body: DeletePostDto) {
    const { userId } = req.user!;
    const dto = deletePostValidator.validate(body);
    return await this.postService.deletePost(userId, dto);
  }

  //  ------------- template ------------

  // 템플릿 생성
  @Post("templates")
  @UseGuards(AuthGuard, ApiGuard)
  async createTemplate(
    @Body() body: CreateTemplateDto,
    @Req() req: AuthRequest
  ) {
    const { userId } = req.user!;
    const dto = createTemplateValidator.validate(body);
    return await this.postService.createTemplate(userId, dto);
  }

  // 전체 공개 템플릿 조회
  @Get("templates")
  async getPublicTemplates(@Query() query: GetPublicTemplatesDto) {
    const dto = getPublicTemplatesValidator.validate(query);
    return await this.postService.getPublicTemplates(dto);
  }

  // 내가 생성한 템플릿 조회
  @Get("templates/my")
  @UseGuards(AuthGuard)
  async getMyTemplates(
    @Req() req: AuthRequest,
    @Query() query: GetMyTemplatesDto
  ) {
    const { userId } = req.user!;
    const dto = getMyTemplatesValidator.validate(query);
    return await this.postService.getMyTemplates(userId, dto);
  }

  // 즐겨찾기한 템플릿 조회
  @Get("templates/my/favorites")
  @UseGuards(AuthGuard)
  async getMyFavoriteTemplates(
    @Req() req: AuthRequest,
    @Query() query: GetMyFavoriteTemplatesDto
  ) {
    const { userId } = req.user!;
    const dto = getMyFavoriteTemplatesValidator.validate(query);
    return await this.postService.getFavoriteTemplates(userId, dto);
  }

  // 템플릿 삭제
  @Delete("templates/:id")
  @UseGuards(AuthGuard, ApiGuard)
  async deleteTemplate(@Param("id") id: string, @Req() req: AuthRequest) {
    const { userId } = req.user!;
    const dto = deleteTemplateValidator.validate({ id });
    return await this.postService.deleteTemplate(userId, dto.id);
  }
}
