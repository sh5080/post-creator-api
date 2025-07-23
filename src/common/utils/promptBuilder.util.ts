import { Part } from "@google/generative-ai";
import { ImageData } from "@common/types/image.type";
import { CreatePostDto } from "@post/dto/post.dto";
import { PostTemplate } from "@common/models/postTemplate.model";
/**
 * Gemini API에 전달할 프롬프트 parts 배열을 구성합니다.
 * @param {CreatePostDto} dto - 포스트 생성 요청 정보
 * @param {ImageData[]} imageDataArray - Base64 인코딩된 이미지 데이터 배열
 * @returns {Part[]} Gemini API의 generateContent 메소드에 전달될 parts 배열
 */
export const buildPostPrompt = (
  dto: CreatePostDto,
  imageDataArray: ImageData[],
  template?: typeof PostTemplate.$inferSelect
): Part[] => {
  const promptParts: Part[] = [];
  const {
    title,
    category,
    clientRequestPrompt,
    keywords,
    keywordCount,
    requiredContentLength,
  } = dto;
  // 1. 타이틀 프롬프트
  promptParts.push({ text: `\n---타이틀---\n${title}\n` });
  // 2. 블로그 포스트 템플릿 프롬프트
  if (template) {
    promptParts.push({ text: template.content });
  }
  // 3. 클라이언트 요청사항 프롬프트
  promptParts.push({
    text: `\n---클라이언트 요청사항---\n카테고리:${category}, 글자 수:${
      requiredContentLength - 100
    } ~ ${requiredContentLength} 사이의 글자 수로 작성해 주세요.\n${clientRequestPrompt}\n`,
  });
  // 4. 키워드 및 횟수 요청
  if (keywords && keywords.length > 0) {
    const keywordInstruction = `\n---필수 키워드---\n다음 키워드를 각 ${keywordCount}회 본문에 자연스럽게 포함해 주세요: ${keywords.join(
      ", "
    )}\n`;
    promptParts.push({ text: keywordInstruction });
  }
  // 5. 이미지 데이터 추가 (각 이미지별로)
  if (imageDataArray && imageDataArray.length > 0) {
    imageDataArray.forEach((imageData, index) => {
      promptParts.push({
        inlineData: {
          data: imageData.data,
          mimeType: imageData.mimeType,
        },
      });
      promptParts.push({ text: `\n[Image ${index + 1} End]` });
    });
  } else {
    promptParts.push({
      text: "\n(이미지 입력이 없습니다. 텍스트 정보만으로 포스트를 작성합니다.)\n",
    });
  }

  promptParts.push({ text: "\n---블로그 포스트 본문---\n" });

  return promptParts;
};
