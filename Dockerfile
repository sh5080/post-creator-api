FROM node:20-slim

WORKDIR /usr/src/app

# 패키지 파일만 먼저 복사하여 캐시 활용
COPY package.json yarn.lock ./

# 프로덕션 의존성만 설치
RUN yarn install --frozen-lockfile --production=false

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN yarn build

# 프로덕션 의존성만 유지하고 개발 의존성 제거
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# Cloud Run은 PORT 환경변수를 사용
CMD ["node", "dist/main.js"]