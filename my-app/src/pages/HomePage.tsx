import React, { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import PostList from '../components/features/posts/PostList';
import Modal from '../components/Modal';
import CreatePost from '../components/CreatePost';
import AdminDeleteButton from '../components/AdminDeleteButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Editor } from '@tinymce/tinymce-react';

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    const postsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postsList);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleOpenPostModal = () => setIsPostModalOpen(true);
  const handleClosePostModal = async () => {
    setIsPostModalOpen(false);
    await fetchPosts(); // 모달 닫으면서 최신 글 목록도 불러오기
  };

  const TinyMCEEditor: React.FC = () => {
    const handleEditorChange = (content: string) => {
      console.log('Content:', content);
    };

    return (
      <Editor
        apiKey="your-api-key" // TinyMCE API 키 (무료 버전은 'no-api-key' 사용 가능)
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | \
                   alignleft aligncenter alignright alignjustify | \
                   bullist numlist outdent indent | removeformat | help'
        }}
        onEditorChange={handleEditorChange}
      />
    );
  };

  return (
    <div className="space-y-6">
      <AdminDeleteButton />
      {/* 헤더 섹션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 커뮤니티</h1>
          <p className="text-gray-600 mt-1">최신 AI 트렌드와 인사이트를 공유해보세요</p>
        </div>
        
        <button
          onClick={handleOpenPostModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          글 작성
        </button>
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
      <PostList posts={posts} loading={loading} />

      {/* 더 보기 버튼 */}
      <div className="text-center">
        <Button variant="outline" className="w-full sm:w-auto">
          더 많은 게시글 보기
        </Button>
      </div>

      <Modal isOpen={isPostModalOpen} onClose={handleClosePostModal}>
        <CreatePost onPostCreated={handleClosePostModal} />
      </Modal>
    </div>
  );
};

export default HomePage; 