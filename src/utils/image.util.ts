import { ImageData } from "../types/image.type";
import multer from "multer";
/**
 * 이미지 Buffer와 MIME 타입을 받아 Base64 인코딩된 ImageData 객체를 반환합니다.
 * @param buffer 이미지 파일의 Buffer
 * @param mimeType 이미지의 MIME 타입 (예: 'image/jpeg', 'image/png')
 * @returns Base64 인코딩된 ImageData 객체
 */
export const processImageBuffer = (
  buffer: Buffer,
  mimeType: string
): ImageData => {
  if (!buffer || buffer.length === 0) {
    throw new Error("Image buffer is empty or invalid.");
  }
  if (!mimeType) {
    throw new Error("Image MIME type is missing.");
  }

  return {
    data: buffer.toString("base64"),
    mimeType: mimeType,
  };
};

// Multer 설정: 메모리 스토리지 사용 (Cloud Run에서 파일 시스템에 저장하는 것보다 간단)
// 주의: 메모리 사용량이 증가할 수 있으므로, 큰 파일이나 많은 파일을 다룰 때는 위험할 수 있습니다.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 파일 크기 제한 (필요에 따라 조정)
    files: 5, // 최대 5개 파일 (필요에 따라 조정)
  },
});
