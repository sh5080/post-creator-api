# AI 블로그 포스트 생성기 🤖✍️

이미지와 요구사항, 키워드를 입력하면 Gemini API를 활용하여 자동으로 블로그 포스트를 생성해주는 AI 서비스입니다.

## 주요 기능 🌟

- 다중 이미지 분석 및 처리
- 사용자 요구사항 기반 컨텐츠 생성
- 필수 키워드 자연스러운 포함
- 키워드 출현 빈도 조절
- 인증된 사용자만 접근 가능
- 커스터마이징 가능한 포스트 템플릿

## 시작하기 🚀

### 필수 요구사항

- Node.js (v18 이상 권장)
- Google Cloud 프로젝트
- Gemini API 키
- Google Cloud CLI (배포용)

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# GCP 설정
PROJECT_ID=your-project-id
REGION=asia-northeast3
SERVICE_NAME=your-service-name
ARTIFACT_REPO=cloud-run-repos
IMAGE_NAME=your-image-name
IMAGE_TAG=latest
SERVICE_ACCOUNT_EMAIL=your-service-account-email

# API 키
GEMINI_API_KEY=your-gemini-api-key

# 서버 설정
FRONT_URL=your-frontend-url

# 인증 설정
JWT_SECRET=your-jwt-secret
AUTH_SALT=your-auth-salt

# 허용된 계정 목록 (JSON 형식 한 줄로 작성)
VALID_CREDENTIALS='[{"email":"user1@example.com","password":"hashed-password-1","role":"admin"},{"email":"user2@example.com","password":"hashed-password-2","role":"user"}]'
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트: 8080)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 배포

```bash
# GCP 인증이 되어있는지 확인
gcloud auth list

# Docker 레지스트리 인증 (최초 1회)
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# 배포 스크립트 실행
./deploy.sh
```

## API 사용법 📝

### 인증

#### 로그인

\`POST /auth/login\`

```bash
curl -X POST "YOUR_CLOUD_RUN_SERVICE_URL/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "your-email@example.com",
  "password": "your-password"
}'
```

**응답 형식**

```json
{
  "token": "your-jwt-token"
}
```

#### 패스워드 해시 생성 (계정 추가용)

\`POST /auth/generate-password\`

```bash
curl -X POST "YOUR_CLOUD_RUN_SERVICE_URL/auth/generate-password" \
-H "Content-Type: application/json" \
-d '{
  "email": "your-email@example.com",
  "password": "your-password"
}'
```

**응답 형식**

```json
{
  "hashedPassword": "generated-hash-value"
}
```

### 블로그 포스트 생성

\`POST /post\`

#### 요청 예시

```bash
curl -X POST "YOUR_CLOUD_RUN_SERVICE_URL/post" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "images=@/path/to/your/image1.jpg" \
-F "images=@/path/to/your/image2.png" \
-F "clientRequestPrompt=이 제품 사진들은 새로운 스마트폰 모델의 특징을 보여줍니다. 휴대폰의 혁신적인 디자인, 카메라 성능, 그리고 사용자 경험에 초점을 맞춰 포스트를 작성해 주세요." \
-F "keywords=[\"혁신적 디자인\", \"고성능 카메라\", \"최고의 사용자 경험\"]" \
-F "keywordCount=2"
```

#### 매개변수 설명

| 파라미터            | 타입     | 필수 | 설명                                    |
| ------------------- | -------- | ---- | --------------------------------------- |
| images              | File[]   | Y    | 분석할 이미지 파일들 (여러 개 가능)     |
| clientRequestPrompt | String   | Y    | 블로그 포스트 작성 요구사항             |
| keywords            | String[] | Y    | 포스트에 포함되어야 할 필수 키워드 목록 |
| keywordCount        | Number   | Y    | 각 키워드의 최소 출현 횟수              |

#### 응답 형식

```json
{
  "message": "블로그 포스트가 성공적으로 생성되었습니다.",
  "blogPost": "생성된 블로그 포스트 내용..."
}
```

## 계정 관리 🔐

새로운 계정을 추가하는 프로세스:

1. `/auth/generate-password` API를 사용하여 새 계정의 패스워드 해시를 생성

   ```bash
   curl -X POST "YOUR_CLOUD_RUN_SERVICE_URL/auth/generate-password" \
   -H "Content-Type: application/json" \
   -d '{"password": "new-user-password"}'
   ```

2. 생성된 해시를 `.env` 파일의 `VALID_CREDENTIALS` 배열에 추가

   ```bash
   VALID_CREDENTIALS='[
     {"email":"existing@example.com","password":"existing-hash","role":"admin"},
     {"email":"new-user@example.com","password":"generated-hash","role":"user"}
   ]'
   ```

   > ⚠️ JSON을 반드시 한 줄로 작성해야 합니다!

3. 서버를 재배포하여 새 계정 활성화
   ```bash
   ./deploy.sh
   ```

## 커스터마이징 ⚙️

### 포스트 템플릿 수정

`src/templates/post.template.ts`에는 기본적인 블로그 포스트 작성 가이드라인이 정의되어 있습니다. 다음과 같은 사항들을 수정할 수 있습니다:

- 포스트 구조 및 형식
- 문체와 톤
- 섹션 구성
- 키워드 사용 방식
- 이미지 설명 스타일

예시:

```typescript
export const POST_TEMPLATE = `
# 포스트 작성 가이드라인

1. 제목은 매력적이고 검색에 최적화되게 작성해주세요.
2. 도입부는 흥미를 유발하는 내용으로 시작하세요.
3. 본문은 다음 구조로 작성해주세요:
   - 주요 특징 소개
   - 장점과 특별한 점
   - 사용 경험 또는 추천 포인트
4. 결론에서는 핵심 내용을 요약하고 행동 유도를 포함하세요.

* 제공된 키워드들을 자연스럽게 포함시켜주세요.
* 이미지의 특징을 상세하게 설명해주세요.
`;
```

## 주의사항 ⚠️

- 이미지는 JPG, PNG 형식만 지원합니다.
- 이미지 크기는 파일당 최대 10MB로 제한됩니다.
- API 요청당 최대 5개의 이미지까지 처리 가능합니다.
- 키워드는 최대 5개까지 지정 가능합니다.
- 모든 API 요청은 인증이 필요합니다 (로그인 제외).
- 계정 추가는 환경변수를 통해서만 가능합니다.
- 환경변수의 JSON은 반드시 한 줄로 작성해야 합니다.

## 라이선스 📄

MIT License
