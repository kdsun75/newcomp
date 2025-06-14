# AI 커뮤니티 플랫폼 PRD (Product Requirements Document)

## 📋 프로젝트 개요

AI 정보 공유를 중심으로 한 커뮤니티 플랫폼을 구축합니다.
사용자들이 자유롭게 AI 관련 글과 정보를 작성하고 댓글을 남기며, 프로필을 설정하고 1:1로 소통할 수 있는 기능을 제공합니다.
Firebase 기반으로 백엔드를 구성하며, 프론트엔드는 React 및 shadcn/ui 라이브러리를 활용하여 현대적이고 깔끔한 UI/UX를 제공합니다.

## 🎯 핵심 목표
- AI 정보 공유를 위한 사용자 친화적인 커뮤니티 플랫폼 구축
- 실시간 소통이 가능한 1:1 채팅 시스템
- 반응형 웹 디자인으로 모든 디바이스에서 최적화된 경험 제공
- Firebase 기반의 안정적이고 확장 가능한 백엔드 구조

## 🛠 기술 스택

### Frontend
- **Framework**: React 18 + Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod

### Backend
- **Authentication**: Firebase Authentication
- **Database**: 
  - Firestore (메인 데이터)
  - Realtime Database (채팅)
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting

## 🔧 핵심 기능

### 1. 사용자 인증 및 관리
- **Firebase Authentication 기반**
  - Google 계정 로그인 연동
  - 이메일/비밀번호 로그인
  - 비밀번호 재설정
  - 이메일 인증

- **사용자 프로필**
  - Firebase Storage를 활용한 프로필 이미지 업로드
  - 프로필 정보 수정 (닉네임, 자기소개)
  - Firestore에 사용자 정보 저장

### 2. 게시글 시스템
- **게시글 CRUD**
  - 글 작성, 수정, 삭제 기능
  - 리치 텍스트 에디터 지원
  - 이미지 및 첨부파일 업로드
  - 태그 시스템

- **게시글 조회**
  - 전체 글 목록 조회
  - 정렬 기능 (최신순, 인기순)
  - 검색 및 필터링
  - 무한 스크롤 페이지네이션

### 3. 상호작용 시스템
- **댓글 시스템**
  - Firestore 서브컬렉션 활용
  - 댓글 작성, 수정, 삭제
  - 대댓글 지원
  - 실시간 업데이트

- **좋아요 및 북마크**
  - 토글 가능한 좋아요 기능
  - 개인 북마크 저장
  - 각 게시물의 좋아요/북마크 수 표시

### 4. 실시간 채팅
- **1:1 채팅 기능**
  - Firebase Realtime Database 사용
  - 실시간 메시지 송수신
  - 메시지 읽음 상태 확인
  - 파일 및 이미지 공유

- **채팅 UI**
  - 채팅방 목록
  - 최근 메시지 미리보기
  - 안읽은 메시지 카운트
  - 온라인 상태 표시

### 5. UI/UX 및 접근성
- **반응형 디자인**
  - Mobile-first 접근
  - 모바일/태블릿/데스크탑 최적화
  - 다크/라이트 모드 지원

- **사용자 경험**
  - 직관적인 네비게이션
  - 로딩 상태 표시
  - 에러 처리 및 피드백
  - 접근성 준수 (ARIA, 키보드 네비게이션)

## 📁 프로젝트 구조

```
ai-community-platform/
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 (auth)/         # 인증 관련 페이지
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── 📁 (dashboard)/    # 메인 앱 페이지
│   │   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   ├── profile/
│   │   │   └── chat/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/         # 재사용 가능한 컴포넌트
│   │   ├── 📁 ui/            # shadcn/ui 컴포넌트
│   │   ├── 📁 forms/         # 폼 컴포넌트
│   │   ├── 📁 layout/        # 레이아웃 컴포넌트
│   │   └── 📁 features/      # 기능별 컴포넌트
│   │       ├── 📁 auth/
│   │       ├── 📁 posts/
│   │       ├── 📁 chat/
│   │       └── 📁 profile/
│   ├── 📁 lib/               # 유틸리티 및 설정
│   │   ├── firebase.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── 📁 hooks/             # 커스텀 훅
│   ├── 📁 store/             # Zustand 스토어
│   ├── 📁 types/             # TypeScript 타입 정의
│   └── 📁 services/          # API 서비스
├── 📁 public/                # 정적 파일
├── 📁 docs/                  # 문서
│   ├── 📄 frontend.md        # 프론트엔드 개발 계획
│   ├── 📄 auth.md            # 인증 시스템 구현
│   ├── 📄 realtimeDB.md      # 실시간 DB 구조
│   └── 📄 storage.md         # 스토리지 구조
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 next.config.js
├── 📄 firebase.json
└── 📄 README.md
```

## 🗄 데이터베이스 구조

### Firestore Collections
```
users/                        # 사용자 정보
posts/                        # 게시글
  └── comments/               # 댓글 (서브컬렉션)
likes/                        # 좋아요 정보
bookmarks/                    # 북마크 정보
chatRooms/                    # 채팅방 메타데이터
```

### Realtime Database Structure
```
chatRooms/                    # 채팅방 정보
messages/                     # 메시지 데이터
userChats/                    # 사용자별 채팅 목록
presence/                     # 온라인 상태
```

### Storage Structure
```
profiles/avatars/             # 프로필 이미지
posts/images/                 # 게시글 이미지
posts/attachments/            # 게시글 첨부파일
chats/images/                 # 채팅 이미지
chats/files/                  # 채팅 파일
```

## 🔐 보안 및 권한

### Authentication Rules
- 로그인한 사용자만 게시글 작성 가능
- 본인 게시글만 수정/삭제 가능
- 프로필 정보는 본인만 수정 가능

### Firestore Security Rules
- 사용자 프로필: 읽기는 모든 사용자, 쓰기는 본인만
- 게시글: 읽기는 모든 사용자, 쓰기는 작성자만
- 댓글: 읽기는 모든 사용자, 쓰기는 작성자만

### Storage Security Rules
- 프로필 이미지: 읽기는 모든 사용자, 업로드는 본인만
- 게시글 파일: 읽기는 모든 사용자, 업로드는 작성자만
- 채팅 파일: 채팅방 참여자만 접근 가능

## 🚀 배포 및 운영

### 배포 환경
- **호스팅**: Firebase Hosting
- **도메인**: 커스텀 도메인 연결
- **SSL**: Firebase Hosting 자동 SSL 적용

### 성능 최적화
- **이미지 최적화**: WebP 포맷 사용, 다양한 해상도 지원
- **코드 분할**: 페이지별 lazy loading
- **캐싱**: React Query를 통한 데이터 캐싱

### 모니터링
- **Firebase Analytics**: 사용자 행동 분석
- **Firebase Performance**: 성능 모니터링
- **Error Tracking**: 에러 로그 수집 및 분석

## 📈 향후 개발 계획

### Phase 1 (MVP)
- [x] 기본 인증 시스템
- [x] 게시글 CRUD
- [x] 댓글 시스템
- [x] 기본 프로필 관리

### Phase 2
- [ ] 1:1 채팅 시스템
- [ ] 좋아요/북마크 기능
- [ ] 고급 검색 및 필터링
- [ ] 다크/라이트 모드

### Phase 3
- [ ] 그룹 채팅
- [ ] 알림 시스템
- [ ] 관리자 패널
- [ ] 모바일 앱 개발

## 🎨 UI/UX 가이드라인

### 디자인 시스템
- **색상**: AI 테마 (블루, 퍼플 계열)
- **폰트**: 시스템 폰트 + 한국어 최적화
- **아이콘**: Lucide React 아이콘 사용
- **컴포넌트**: shadcn/ui 기반 커스터마이징

### 반응형 브레이크포인트
- Mobile: 320px ~ 768px
- Tablet: 768px ~ 1024px
- Desktop: 1024px+

---

**📝 문서 업데이트 히스토리**
- 2024.01.01: 초기 PRD 작성
- 2024.01.02: 프론트엔드 개발 계획 추가
- 2024.01.03: 인증 시스템 구현 상세 문서 추가
- 2024.01.04: 실시간 DB 및 스토리지 구조 설계 완료
