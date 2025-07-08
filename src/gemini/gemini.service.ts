import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { env } from "../configs/env.config";

const geminiApiKey = env.GEMINI.API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

// 사용할 Gemini 모델 (이미지 처리를 위해 -vision 모델 사용)
// 최신 버전 사용을 권장하며, 'gemini-1.5-flash' 또는 'gemini-1.5-pro' 등 사용
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Gemini API를 호출하여 블로그 포스트를 생성합니다.
 * @param {Part[]} promptParts - Gemini API의 generateContent 메소드에 전달될 parts 배열
 * @returns {Promise<string>} 생성된 블로그 포스트 텍스트
 */
export const generateBlogPostWithGemini = async (
  promptParts: Part[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const generatedText = response.text();

    return generatedText;
  } catch (error: any) {
    console.error(`Gemini API 오류 발생: ${error.message}`);
    // GoogleGenerativeAIError 타입을 더 구체적으로 처리 가능
    if (error.response && error.response.statusText) {
      console.error("Gemini API 상세 오류:", error.response.statusText);
    }
    throw new Error(`Gemini API 오류: ${error.message}`);
  }
};
