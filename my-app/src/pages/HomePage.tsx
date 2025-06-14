import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import PostList from '../components/features/posts/PostList';

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('latest');
  const [loading, setLoading] = useState(false);

  // 모의 데이터
  const mockPosts = [
    {
      id: '1',
      title: 'ChatGPT-4의 새로운 기능 소개',
      content: 'OpenAI에서 발표한 ChatGPT-4의 혁신적인 기능들을 자세히 살펴보겠습니다. 특히 멀티모달 기능과 향상된 추론 능력에 대해 이야기해보겠습니다. 이번 업데이트로 인해 AI 업계에 어떤 변화가 일어날지 함께 분석해보겠습니다.',
      author: {
        name: '김개발자',
        avatar: undefined,
      },
      createdAt: '2024-01-15T10:30:00Z',
      likes: 24,
      comments: 8,
      tags: ['ChatGPT', '인공지능', '오픈AI'],
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: '2',
      title: '머신러닝 모델 성능 최적화 팁',
      content: '실제 프로덕션 환경에서 머신러닝 모델의 성능을 향상시키는 다양한 방법들을 소개합니다. 하이퍼파라미터 튜닝부터 데이터 전처리, 모델 앙상블까지 실무에서 바로 적용할 수 있는 팁들을 정리했습니다.',
      author: {
        name: '이데이터',
        avatar: undefined,
      },
      createdAt: '2024-01-14T15:20:00Z',
      likes: 18,
      comments: 12,
      tags: ['머신러닝', '최적화', '성능향상'],
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: '3',
      title: 'Python으로 시작하는 딥러닝 기초',
      content: '딥러닝을 처음 시작하는 분들을 위한 완벽 가이드입니다. Python과 TensorFlow를 사용하여 첫 번째 신경망을 구축하는 방법부터 실제 프로젝트까지 단계별로 설명드립니다.',
      author: {
        name: '박머신',
        avatar: undefined,
      },
      createdAt: '2024-01-13T09:15:00Z',
      likes: 32,
      comments: 15,
      tags: ['Python', '딥러닝', '초보자'],
      isLiked: false,
      isBookmarked: false,
    },
  ];

  const filters = [
    { key: 'latest', label: '최신순', active: activeFilter === 'latest' },
    { key: 'popular', label: '인기순', active: activeFilter === 'popular' },
    { key: 'trending', label: '트렌딩', active: activeFilter === 'trending' },
  ];

  const handleFilterChange = (filterKey: string) => {
    setActiveFilter(filterKey);
    setLoading(true);
    // 실제로는 API 호출
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 커뮤니티</h1>
          <p className="text-gray-600 mt-1">최신 AI 트렌드와 인사이트를 공유해보세요</p>
        </div>
        
        <Button variant="primary" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          글 작성
        </Button>
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter.active
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
          <Filter className="w-4 h-4" />
          <span>필터</span>
        </button>
      </div>

      {/* 게시글 목록 */}
      <PostList posts={mockPosts} loading={loading} />

      {/* 더 보기 버튼 */}
      <div className="text-center">
        <Button variant="outline" className="w-full sm:w-auto">
          더 많은 게시글 보기
        </Button>
      </div>
    </div>
  );
};

export default HomePage; 