import React from 'react';
import { Home, PenTool, MessageCircle, User, Bookmark, TrendingUp, Hash, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onWriteClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onWriteClick }) => {
  const { currentUser } = useAuth();
  const menuItems = [
    { icon: Home, label: '홈', href: '#', active: true },
    { icon: TrendingUp, label: '인기', href: '#', active: false },
    { icon: MessageCircle, label: '채팅', href: '#', active: false },
    { icon: Bookmark, label: '북마크', href: '#', active: false },
    { icon: User, label: '프로필', href: '#', active: false },
  ];

  const categories = [
    { name: 'AI 뉴스', count: 24 },
    { name: '머신러닝', count: 15 },
    { name: '딥러닝', count: 32 },
    { name: 'ChatGPT', count: 8 },
    { name: '자연어처리', count: 12 },
    { name: '컴퓨터비전', count: 9 },
  ];

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={clsx(
          'fixed top-16 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto py-6">
          {/* 메인 메뉴 */}
          <nav className="px-4 space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={clsx(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  item.active
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* 구분선 */}
          <div className="my-6 px-4">
            <div className="border-t border-gray-200"></div>
          </div>

          {/* 카테고리 */}
          <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              카테고리
            </h3>
            <nav className="space-y-1">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2 text-gray-400" />
                    {category.name}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* 하단 정보 */}
          <div className="mt-auto px-4 py-6">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                AI Community Pro
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                더 많은 기능을 경험해보세요
              </p>
              <button className="w-full bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-primary-700 transition-colors">
                업그레이드
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 