#!/bin/bash

# .env 파일에서 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "❌ .env 파일을 찾을 수 없습니다."
  exit 1
fi

# GCP 인증 상태 확인
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q '^'; then
  echo "❌ GCP 계정에 로그인되어 있지 않습니다."
  echo "🔑 다음 명령어로 로그인해주세요: gcloud auth login"
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
  "FRONT_URL"
  "JWT_SECRET"
  "AUTH_SALT"
  "VALID_CREDENTIALS"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 필수 환경 변수 ${var}가 설정되지 않았습니다."
    exit 1
  fi
done

# env.yaml 생성
echo "📝 env.yaml 파일 생성 중..."
cat > env.yaml << EOL
GEMINI_API_KEY: ${GEMINI_API_KEY}
FRONT_URL: ${FRONT_URL}
JWT_SECRET: ${JWT_SECRET}
AUTH_SALT: ${AUTH_SALT}
VALID_CREDENTIALS: '${VALID_CREDENTIALS}'
EOL

# cleanup 함수 정의
cleanup() {
  echo "🧹 env.yaml 파일 삭제 중..."
  rm -f env.yaml
}

# 스크립트 종료 시 cleanup 실행
trap cleanup EXIT

# --- 빌드 단계 ---
echo "🔄 프로젝트 설정: ${PROJECT_ID}"
gcloud config set project ${PROJECT_ID}

echo "🏗️ Building and pushing Docker image to Artifact Registry..."
gcloud builds submit \
  --tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG} \
  --project ${PROJECT_ID}

if [ $? -ne 0 ]; then
  echo "❌ Docker image build and push failed."
  echo "💡 인증 문제일 수 있습니다. 다음 명령어로 다시 로그인해보세요:"
  echo "   gcloud auth login"
  echo "   gcloud auth configure-docker ${REGION}-docker.pkg.dev"
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
  --env-vars-file env.yaml \
  --allow-unauthenticated \
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