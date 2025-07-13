import { Request, Response } from "express";
import { generateBlogPostWithGemini } from "@gemini/gemini.service";
import { processImageBuffer } from "@common/utils/image.util";
import { buildGeminiPrompt } from "@common/utils/promptBuilder.util";
import { ImageData } from "@common/types/image.type";
import { BadRequestException } from "@common/types/response.type";
import { createPostValidator } from "./dto/post.dto";

export class PostController {
  generatePost = async (req: Request, res: Response) => {
    try {
      req.body.keywords = JSON.parse(req.body.keywords);
      const { clientRequestPrompt, keywords, keywordCount } =
        createPostValidator.validate(req.body);

      const uploadedFiles = req.files as Express.Multer.File[];
      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new BadRequestException(
          "입력 유효성 검사 오류: 이미지가 제공되지 않았습니다."
        );
      }

      // 2. 업로드된 이미지를 Base64로 변환
      const imageDataArray: ImageData[] = uploadedFiles.map((file) =>
        processImageBuffer(file.buffer, file.mimetype)
      );

      // 3. Gemini API 프롬프트 구성
      const promptParts = buildGeminiPrompt(
        clientRequestPrompt,
        keywords,
        keywordCount,
        imageDataArray
      );

      // 4. Gemini API 호출
      const generatedBlogPost = await generateBlogPostWithGemini(promptParts);

      // 5. 결과 반환
      res.status(200).json({
        message: "블로그 포스트가 성공적으로 생성되었습니다.",
        blogPost: generatedBlogPost,
      });
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };
}
