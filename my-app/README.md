# AI Community Platform

AI 정보 공유를 중심으로 한 현대적인 커뮤니티 플랫폼입니다.

## 🚀 주요 기능

- **게시글 시스템**: AI 관련 글과 정보를 자유롭게 공유
- **실시간 채팅**: 1:1 채팅을 통한 직접적인 소통
- **상호작용**: 좋아요, 댓글, 북마크 기능
- **사용자 인증**: 이메일 및 Google 소셜 로그인
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🛠 기술 스택

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend (예정)
- **Firebase Authentication**
- **Firestore** (메인 데이터베이스)
- **Realtime Database** (채팅)
- **Firebase Storage** (파일 저장)

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/                 # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── features/           # 기능별 컴포넌트
│       ├── auth/
│       ├── posts/
│       └── chat/
├── pages/                  # 페이지 컴포넌트
├── hooks/                  # 커스텀 훅
├── store/                  # 상태 관리
└── utils/                  # 유틸리티 함수
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue 계열 (#3b82f6)
- **Secondary**: Purple 계열 (#a855f7)
- **Gray Scale**: 다양한 회색 톤

### 컴포넌트
- **재사용 가능한 UI 컴포넌트** 기반
- **일관된 스타일링** 적용
- **접근성** 준수

## 🚦 시작하기

### 필수 요구사항
- Node.js 16.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm start
   ```

3. **빌드**
   ```bash
   npm run build
   ```

## 📱 주요 화면

### 홈페이지
- 최신 AI 관련 게시글 목록
- 정렬 및 필터링 기능
- 반응형 카드 레이아웃

### 사이드바
- 주요 네비게이션 메뉴
- AI 카테고리별 분류
- 사용자 상태 표시

### 게시글 카드
- 작성자 정보 표시
- 좋아요/댓글/북마크 상호작용
- 태그 시스템

### 채팅 시스템
- 실시간 메시지 목록
- 온라인 상태 표시
- 읽지 않은 메시지 카운트

## 🔮 향후 계획

### Phase 1 (현재 - UI 뼈대)
- [x] 기본 UI 컴포넌트 구조
- [x] 레이아웃 및 네비게이션
- [x] 게시글 카드 디자인
- [x] 로그인 폼 구조

### Phase 2 (다음 단계)
- [ ] Firebase 통합
- [ ] 실제 데이터 연동
- [ ] 인증 시스템 구현
- [ ] 게시글 CRUD 기능

### Phase 3 (미래)
- [ ] 실시간 채팅 구현
- [ ] 알림 시스템
- [ ] 고급 검색 기능
- [ ] 모바일 앱 개발

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락주세요.

---

**🎯 목표**: AI 커뮤니티를 위한 최고의 플랫폼을 만들어 나가겠습니다!
