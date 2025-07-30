# AI 블로그 포스트 생성기 API 🤖✍️

NestJS와 Fastify를 기반으로 한 AI 블로그 포스트 생성 API 서비스입니다. 이미지 분석과 Gemini AI를 활용하여 사용자 요구사항에 맞는 블로그 포스트를 자동으로 생성합니다.

## 주요 기능 🌟

- **AI 기반 블로그 포스트 생성**: Gemini API를 활용한 스마트 컨텐츠 생성
- **다중 이미지 분석**: 최대 5개 이미지 동시 처리 및 분석
- **템플릿 시스템**: 재사용 가능한 포스트 템플릿 생성 및 관리
- **즐겨찾기 기능**: 템플릿 즐겨찾기 및 관리
- **사용자 인증**: JWT 기반 인증 시스템
- **카테고리 분류**: 기술, 라이프, 여행, 음식, 패션 카테고리 지원
- **AWS S3 연동**: 이미지 저장 및 관리
- **PostgreSQL 데이터베이스**: Drizzle ORM을 활용한 데이터 관리

## 기술 스택 🛠️

### Backend

- **Framework**: NestJS 11.x
- **Runtime**: Node.js 20.x
- **HTTP Server**: Fastify
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Fastify Multipart
- **Logging**: Pino
- **Validation**: Joi

### AI & Cloud Services

- **AI Service**: Google Gemini API
- **Cloud Storage**: AWS S3
- **Deployment**: Google Cloud Run
- **Container Registry**: Google Artifact Registry

## 프로젝트 구조 📁

```
src/
├── app.controller.ts          # 메인 컨트롤러
├── app.module.ts             # 루트 모듈
├── app.service.ts            # 메인 서비스
├── main.ts                   # 애플리케이션 진입점
├── common/                   # 공통 모듈
│   ├── configs/             # 설정 파일
│   ├── database/            # 데이터베이스 관련
│   ├── guards/              # 인증 가드
│   ├── interceptors/        # 인터셉터
│   ├── middlewares/         # 미들웨어
│   ├── models/              # 데이터베이스 모델
│   ├── types/               # 타입 정의
│   ├── utils/               # 유틸리티 함수
│   └── validators/          # 유효성 검사
└── domains/                 # 도메인별 모듈
    ├── auth/                # 인증 도메인
    ├── gemini/              # AI 서비스
    ├── post/                # 포스트 도메인
    └── user/                # 사용자 도메인
```

## 시작하기 🚀

### 필수 요구사항

- Node.js 20.x 이상
- PostgreSQL 데이터베이스 (Neon 권장)
- Google Cloud 프로젝트
- Gemini API 키
- AWS S3 버킷

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# 서버 설정
PORT=3000
FRONT_URL=http://localhost:5173
DB_URL=postgresql://username:password@host:port/database

# AI 설정
GEMINI_API_KEY=your-gemini-api-key

# 인증 설정
JWT_SECRET=your-jwt-secret
AUTH_SALT=your-auth-salt
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3 설정
AWS_BUCKET=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

### 데이터베이스 설정

```bash
# 마이그레이션 생성
yarn db:generate

# 마이그레이션 실행
yarn db:migrate

# 데이터베이스 스키마 동기화
yarn db:push

# Drizzle Studio 실행 (개발용)
yarn db:studio
```

## API 문서 📚

### 인증 API

#### 회원가입

```http
POST /api/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "사용자명"
}
```

#### 로그인

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 헤더**:

- `Authorization`: Access Token
- `refreshToken`: Refresh Token
- `X-A-Token`: API Token

### 포스트 API

#### 블로그 포스트 생성

```http
POST /api/posts
Authorization: Bearer <access-token>
X-A-Token: <api-token>
Content-Type: multipart/form-data

Form Data:
- images: [파일1, 파일2, ...] (최대 5개, 각 10MB 이하)
- title: "포스트 제목"
- content: "포스트 내용"
- category: "tech" | "life" | "travel" | "food" | "fashion"
```

#### 내 포스트 조회

```http
GET /api/posts/my?page=1&limit=10
Authorization: Bearer <access-token>
```

#### 포스트 삭제

```http
DELETE /api/posts
Authorization: Bearer <access-token>
X-A-Token: <api-token>
Content-Type: application/json

{
  "postId": "post-uuid"
}
```

### 템플릿 API

#### 템플릿 생성

```http
POST /api/posts/templates
Authorization: Bearer <access-token>
X-A-Token: <api-token>
Content-Type: application/json

{
  "name": "템플릿 이름",
  "content": "템플릿 내용",
  "category": "tech",
  "isPublic": true
}
```

#### 공개 템플릿 조회

```http
GET /api/posts/templates?page=1&limit=10&category=tech
```

#### 내 템플릿 조회

```http
GET /api/posts/templates/my?page=1&limit=10
Authorization: Bearer <access-token>
```

#### 즐겨찾기 템플릿 조회

```http
GET /api/posts/templates/my/favorites?page=1&limit=10
Authorization: Bearer <access-token>
```

#### 템플릿 삭제

```http
DELETE /api/posts/templates/:id
Authorization: Bearer <access-token>
X-A-Token: <api-token>
```

### 사용자 API

#### 닉네임 변경

```http
POST /api/users/update-nickname
Authorization: Bearer <access-token>
X-A-Token: <api-token>
Content-Type: application/json

{
  "nickname": "새로운 닉네임"
}
```

#### 비밀번호 변경

```http
POST /api/users/update-password
Authorization: Bearer <access-token>
X-A-Token: <api-token>
Content-Type: application/json

{
  "currentPassword": "현재 비밀번호",
  "newPassword": "새로운 비밀번호"
}
```

#### 계정 삭제

```http
DELETE /api/users
Authorization: Bearer <access-token>
X-A-Token: <api-token>
```

## 배포 🚀

### Google Cloud Run 배포

1. **GCP 인증**

```bash
gcloud auth login
gcloud auth configure-docker asia-northeast3-docker.pkg.dev
```

2. **환경 변수 설정**
   `.env` 파일에 배포 관련 변수 추가:

```bash
PROJECT_ID=your-project-id
REGION=asia-northeast3
SERVICE_NAME=post-creator-api
ARTIFACT_REPO=cloud-run-repos
IMAGE_NAME=post-creator
IMAGE_TAG=latest
SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

3. **배포 실행**

```bash
./deploy.sh
```

## 개발 가이드 👨‍💻

### 코드 스타일

- TypeScript strict 모드 사용
- ESLint + Prettier 규칙 준수
- 모듈별 도메인 분리
- DTO 기반 유효성 검사
- 인터셉터를 통한 응답 표준화

### 데이터베이스 마이그레이션

```bash
# 새로운 마이그레이션 생성
yarn db:generate

# 마이그레이션 실행
yarn db:migrate

# 스키마 변경사항 확인
yarn db:studio
```

### 로깅

Pino를 사용한 구조화된 로깅:

- 개발 환경: Pretty print
- 프로덕션 환경: JSON 형식

## 주의사항 ⚠️

- 이미지는 JPG, PNG 형식만 지원
- 이미지 크기는 파일당 최대 10MB
- API 요청당 최대 5개 이미지 처리
- 모든 API 요청은 인증 필요 (회원가입, 로그인 제외)
- JWT 토큰은 15분 후 만료, Refresh Token으로 갱신
- API Token은 요청당 한 번만 사용 가능

## 라이선스 📄

MIT License
