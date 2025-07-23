import { ImageData } from "@common/types/image.type";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@common/configs/env.config";
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

// S3 클라이언트 생성
const region = "ap-northeast-2";
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: env.AWS.ACCESS_KEY_ID,
    secretAccessKey: env.AWS.SECRET_ACCESS_KEY,
  },
});

/**
 * S3에 이미지 업로드
 * @param buffer 이미지 파일의 Buffer
 * @param key S3에 저장할 경로/파일명
 * @param mimeType 이미지의 MIME 타입
 * @returns 업로드된 이미지의 S3 URL
 */
export async function uploadImageToS3(
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS.BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );
  return `https://${env.AWS.BUCKET}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * S3에서 이미지 삭제
 * @param key S3에 저장된 경로/파일명
 */
export async function deleteImageFromS3(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.AWS.BUCKET,
      Key: key,
    })
  );
}

export async function getPresignedImageUrl(key: string, expiresInSec = 60) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: expiresInSec });
}
