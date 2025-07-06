#!/bin/bash

# .env 파일에서 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "❌ .env 파일을 찾을 수 없습니다."
  exit 1
fi

# 필수 환경 변수 체크
required_vars=(
  "PROJECT_ID"
  "REGION"
  "SERVICE_NAME"
  "ARTIFACT_REPO"
  "IMAGE_NAME"
  "IMAGE_TAG"
  "SERVICE_ACCOUNT_EMAIL"
  "GEMINI_API_KEY"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 필수 환경 변수 ${var}가 설정되지 않았습니다."
    exit 1
  fi
done

# --- 빌드 단계 ---
echo "🏗️ Building and pushing Docker image to Artifact Registry..."
gcloud builds submit \
  --tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG} \
  --project ${PROJECT_ID}

if [ $? -ne 0 ]; then
  echo "❌ Docker image build and push failed. Exiting."
  exit 1
fi
echo "✅ Docker image built and pushed successfully."

# --- 배포 단계 ---
echo "🚀 Deploying to Google Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG} \
  --platform managed \
  --region ${REGION} \
  --service-account ${SERVICE_ACCOUNT_EMAIL} \
  --set-env-vars GEMINI_API_KEY="${GEMINI_API_KEY}" \
  --allow-unauthenticated \
  --port 8080 \
  --project ${PROJECT_ID}

if [ $? -ne 0 ]; then
  echo "❌ Cloud Run deployment failed. Exiting."
  exit 1
fi
echo "🎉 Cloud Run service deployed successfully!"

# 배포된 서비스 URL 확인
echo "🔗 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format "value(status.url)"