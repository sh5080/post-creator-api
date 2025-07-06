import { ErrorResponse } from "../types/response.type";

export const handleError = (error: Error): ErrorResponse => {
  console.error("오류 발생:", error.message);
  if (error.stack) {
    console.error("스택 트레이스:", error.stack);
  }

  let statusCode = 500;
  let message = "내부 서버 오류가 발생했습니다.";

  if (error.message.includes("입력 유효성 검사 오류")) {
    statusCode = 400;
    message = error.message;
  } else if (error.message.includes("Gemini API 오류")) {
    statusCode = 502; // Bad Gateway
    message = error.message;
  } else if (error.message.includes("S3 다운로드 오류")) {
    statusCode = 500;
    message = error.message;
  }
  // 기타 특정 오류 처리 로직 추가 가능

  return {
    statusCode: statusCode,
    message: message,
  };
};
