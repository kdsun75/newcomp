# Firebase Authentication Implementation

## 1. 인증 시스템 개요

Firebase Authentication을 사용하여 이메일/비밀번호 로그인과 Google 소셜 로그인을 구현합니다.
보안성과 사용자 경험을 모두 고려한 인증 플로우를 설계합니다.

## 2. Firebase 설정

### 2.1 Firebase 프로젝트 설정
```typescript
// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google 로그인 설정
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
```

## 3. 인증 구현

### 3.1 이메일/비밀번호 인증
```typescript
// auth.service.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  User
} from 'firebase/auth';

export const authService = {
  // 회원가입
  async signUp(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 프로필 정보 업데이트
      await updateProfile(user, { displayName });
      
      // Firestore에 사용자 정보 저장
      await this.createUserProfile(user, { displayName });
      
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 로그인
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 로그아웃
  async signOut() {
    await signOut(auth);
  },

  // 비밀번호 재설정
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }
};
```

### 3.2 Google 소셜 로그인
```typescript
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

export const googleAuthService = {
  // 팝업을 통한 Google 로그인
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 첫 로그인인지 확인
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        await this.createUserProfile(user);
      }
      
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 리다이렉트를 통한 Google 로그인 (모바일 친화적)
  async signInWithGoogleRedirect() {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 리다이렉트 결과 처리
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        
        if (isNewUser) {
          await this.createUserProfile(user);
        }
        
        return user;
      }
      return null;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }
};
```

## 4. 사용자 프로필 관리

### 4.1 Firestore 사용자 데이터 구조
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  loginProvider: 'email' | 'google';
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
```

### 4.2 사용자 프로필 생성 및 관리
```typescript
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

export const userService = {
  // 사용자 프로필 생성
  async createUserProfile(user: User, additionalData?: Partial<UserProfile>) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        loginProvider: user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
        isEmailVerified: user.emailVerified,
        preferences: {
          theme: 'light',
          notifications: true
        },
        ...additionalData
      };
      
      await setDoc(userRef, userProfile);
    }
  },

  // 사용자 프로필 조회
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  },

  // 사용자 프로필 업데이트
  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }
};
```

## 5. 인증 상태 관리

### 5.1 React Context를 통한 상태 관리
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const profile = await userService.getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signInWithGoogle: googleAuthService.signInWithGoogle,
    signOut: authService.signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 6. 보안 규칙

### 6.1 Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 프로필 보안 규칙
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시글 보안 규칙
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // 댓글 보안 규칙
    match /posts/{postId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // 좋아요/북마크 보안 규칙
    match /users/{userId}/likes/{postId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/bookmarks/{postId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. 보호된 라우트 구현

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};
```

## 8. 에러 처리

```typescript
// utils/authErrors.ts
export const handleAuthError = (error: any): Error => {
  switch (error.code) {
    case 'auth/user-not-found':
      return new Error('등록되지 않은 이메일입니다.');
    case 'auth/wrong-password':
      return new Error('비밀번호가 올바르지 않습니다.');
    case 'auth/email-already-in-use':
      return new Error('이미 사용 중인 이메일입니다.');
    case 'auth/weak-password':
      return new Error('비밀번호는 6자 이상이어야 합니다.');
    case 'auth/invalid-email':
      return new Error('유효하지 않은 이메일 형식입니다.');
    case 'auth/popup-closed-by-user':
      return new Error('로그인이 취소되었습니다.');
    case 'auth/cancelled-popup-request':
      return new Error('이미 진행 중인 로그인이 있습니다.');
    default:
      return new Error('로그인 중 오류가 발생했습니다.');
  }
};
```

## 9. 인증 관련 유틸리티

```typescript
// utils/auth.utils.ts
export const authUtils = {
  // 이메일 유효성 검사
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 비밀번호 강도 검사
  isStrongPassword: (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  },

  // 사용자 권한 확인
  hasPermission: (user: User | null, permission: string): boolean => {
    if (!user) return false;
    // 권한 로직 구현
    return true;
  }
};
```
