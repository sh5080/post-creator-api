import blogPostTemplate from "@common/templates/post.template";
import { Part } from "@google/generative-ai";
import { ImageData } from "@common/types/image.type";

/**
 * Gemini API에 전달할 프롬프트 parts 배열을 구성합니다.
 * @param {string} clientRequestPrompt - 클라이언트의 요청사항 프롬프트
 * @param {string[]} keywords - 필수로 포함되어야 하는 키워드 배열
 * @param {number} keywordCount - 각 키워드의 최소 포함 횟수
 * @param {ImageData[]} imageDataArray - Base64 인코딩된 이미지 데이터 배열
 * @returns {Part[]} Gemini API의 generateContent 메소드에 전달될 parts 배열
 */
export const buildGeminiPrompt = (
  clientRequestPrompt: string,
  keywords: string[],
  keywordCount: number,
  imageDataArray: ImageData[]
): Part[] => {
  const promptParts: Part[] = [];

  // 1. 블로그 포스트 템플릿 프롬프트
  promptParts.push({ text: blogPostTemplate });

  // 2. 클라이언트 요청사항 프롬프트
  promptParts.push({
    text: `\n---클라이언트 요청사항---\n${clientRequestPrompt}\n`,
  });

  // 3. 키워드 및 횟수 요청
  if (keywords && keywords.length > 0) {
    const keywordInstruction = `\n---필수 키워드---\n다음 키워드를 각 ${keywordCount}회 본문에 자연스럽게 포함해 주세요: ${keywords.join(
      ", "
    )}\n`;
    promptParts.push({ text: keywordInstruction });
  }

  // 4. 이미지 데이터 추가 (각 이미지별로)
  if (imageDataArray && imageDataArray.length > 0) {
    imageDataArray.forEach((imageData, index) => {
      promptParts.push({
        inlineData: {
          data: imageData.data,
          mimeType: imageData.mimeType,
        },
      });
      // 이미지별로 간단한 주석을 달아 Gemini가 각 이미지를 구분하고 참조하기 쉽게 할 수 있습니다.
      // promptParts.push({ text: `\n[Image ${index + 1} End]` });
    });
  } else {
    // 이미지가 없으면 텍스트 기반으로만 생성하도록 유도
    promptParts.push({
      text: "\n(이미지 입력이 없습니다. 텍스트 정보만으로 포스트를 작성합니다.)\n",
    });
  }

  promptParts.push({ text: "\n---블로그 포스트 본문---\n" });

  return promptParts;
};
