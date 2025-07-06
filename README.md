# AI 블로그 포스트 생성기 🤖✍️

이미지와 요구사항, 키워드를 입력하면 Gemini API를 활용하여 자동으로 블로그 포스트를 생성해주는 AI 서비스입니다.

## 주요 기능 🌟

- 다중 이미지 분석 및 처리
- 사용자 요구사항 기반 컨텐츠 생성
- 필수 키워드 자연스러운 포함
- 키워드 출현 빈도 조절

## 시작하기 🚀

### 필수 요구사항

- Node.js (v18 이상 권장)
- Google Cloud 프로젝트
- Gemini API 키

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
PROJECT_ID=your-project-id
REGION=your-region
SERVICE_NAME=your-service-name
ARTIFACT_REPO=your-artifact-repo
IMAGE_NAME=your-image-name
IMAGE_TAG=latest
SERVICE_ACCOUNT_EMAIL=your-service-account-email
GEMINI_API_KEY=your-gemini-api-key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 배포

```bash
# 배포 스크립트 실행
./deploy.sh
```

## API 사용법 📝

### 블로그 포스트 생성 엔드포인트

\`POST /generate-post\`

#### 요청 예시

```bash
curl -X POST "YOUR_CLOUD_RUN_SERVICE_URL/generate-post" \
-H "Content-Type: multipart/form-data" \
-F "images=@/path/to/your/image1.jpg" \
-F "images=@/path/to/your/image2.png" \
-F "clientRequestPrompt=이 제품 사진들은 새로운 스마트폰 모델의 특징을 보여줍니다. 휴대폰의 혁신적인 디자인, 카메라 성능, 그리고 사용자 경험에 초점을 맞춰 포스트를 작성해 주세요." \
-F "keywords=[\"혁신적 디자인\", \"고성능 카메라\", \"최고의 사용자 경험\"]" \
-F "keywordCount=2"
```

#### 매개변수 설명

| 파라미터            | 타입     | 설명                                    |
| ------------------- | -------- | --------------------------------------- |
| images              | File[]   | 분석할 이미지 파일들 (여러 개 가능)     |
| clientRequestPrompt | String   | 블로그 포스트 작성 요구사항             |
| keywords            | String[] | 포스트에 포함되어야 할 필수 키워드 목록 |
| keywordCount        | Number   | 각 키워드의 최소 출현 횟수              |

#### 응답 형식

```json
{
  "message": "블로그 포스트가 성공적으로 생성되었습니다.",
  "blogPost": "생성된 블로그 포스트 내용..."
}
```

## 주의사항 ⚠️

- 이미지는 JPG, PNG 형식만 지원합니다.
- 이미지 크기는 파일당 최대 10MB로 제한됩니다.
- API 요청당 최대 5개의 이미지까지 처리 가능합니다.
- 키워드는 최대 10개까지 지정 가능합니다.

## 라이선스 📄

MIT License
