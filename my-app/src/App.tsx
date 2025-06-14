import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SurveyPage from './pages/SurveyPage';
import './App.css';

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// 인증 후 설문조사 완료 확인하는 컴포넌트
const SurveyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // 설문조사가 완료되지 않았다면 설문조사 페이지로 리다이렉트
  if (userProfile && !userProfile.surveyCompleted) {
    return <Navigate to="/survey" />;
  }
  
  return <>{children}</>;
};

// 로그인이 필요하지 않은 라우트 (이미 로그인된 경우 홈으로 리다이렉트)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return currentUser ? <Navigate to="/" /> : <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 공개 라우트 */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        {/* 보호된 라우트 */}
        <Route 
          path="/survey" 
          element={
            <ProtectedRoute>
              <SurveyPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <SurveyGuard>
                <Layout>
                  <HomePage />
                </Layout>
              </SurveyGuard>
            </ProtectedRoute>
          } 
        />
        
        {/* 기본 라우트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
