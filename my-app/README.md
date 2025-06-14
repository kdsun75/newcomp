# React TypeScript Project

## 프로젝트 개요
이 프로젝트는 React와 TypeScript를 사용한 웹 애플리케이션입니다.

## 필수 요구사항
- Node.js 16.x 이상
- npm 8.x 이상

## 설치 방법

1. 저장소 클론
```bash
git clone [repository-url]
cd my-app
```

2. 의존성 설치
```bash
npm install
```

## 주요 의존성 버전
- React: ^18.2.0
- TypeScript: ^4.9.5
- React Router DOM: ^6.15.0
- Firebase: ^11.9.1
- Tailwind CSS: ^3.3.3

## 개발 서버 실행
```bash
npm start
```
개발 서버는 http://localhost:3000 에서 실행됩니다.

## 빌드
```bash
npm run build
```

## 테스트
```bash
npm test
```

## 주의사항
1. ESLint 경고
   - Header.tsx와 Sidebar.tsx 컴포넌트에서 href 속성 관련 경고가 있습니다.
   - 실제 링크가 필요한 경우 유효한 URL을 제공하거나, 버튼으로 대체하는 것을 권장합니다.

2. 의존성 충돌 방지
   - package.json에 명시된 정확한 버전을 사용하세요.
   - 새로운 패키지 설치 시 `npm install [package-name] --save-exact` 옵션을 사용하여 버전을 고정하는 것을 권장합니다.

## 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 문제 해결
1. 의존성 설치 실패 시
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

2. TypeScript 컴파일 에러 발생 시
```bash
npm run build
```
를 실행하여 자세한 에러 메시지를 확인하세요.

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
