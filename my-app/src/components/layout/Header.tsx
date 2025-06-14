import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, LogOut, ChevronDown, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  onWriteClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onWriteClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 네비게이션 */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Community</span>
              </div>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                홈
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                게시글
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                채팅
              </a>
              <Link
                to="/profile"
                className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                프로필
              </Link>
            </nav>
          </div>

          {/* 검색 및 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 검색 */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="검색..."
                    className="w-64 h-8 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* 알림 */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* 사용자 메뉴 */}
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="프로필"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {currentUser.displayName || '사용자'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* 드롭다운 메뉴 */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{currentUser.displayName}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      프로필 설정
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      설정
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" size="sm">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 