import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import ToastUIEditor from './ToastUIEditor';
import { deleteAllPosts } from '../lib/deleteAllPosts';
import { deleteAllPostsAndFiles } from '../lib/deleteAllPostsAndFiles';
import { Editor } from '@toast-ui/react-editor';

interface CreatePostProps {
  onPostCreated: () => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const { currentUser } = useAuth();
  const editorRef = useRef<Editor>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    try {
      console.log('저장할 데이터:', { title, content, tags });
      const postData = {
        authorId: currentUser.uid,
        title,
        content,
        tags,
        images: [],
        attachments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likeCount: 0,
        bookmarkCount: 0,
        commentCount: 0
      };

      await addDoc(collection(db, 'posts'), postData);
      
      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setCurrentTag('');
      
      await onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      if (error instanceof Error) {
        alert('게시글 작성 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('게시글 작성 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <ToastUIEditor
            value={content}
            onChange={setContent}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            태그
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="태그 입력 후 엔터"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="mt-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              추가
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          게시글 작성
        </button>
      </form>
      <button onClick={deleteAllPosts}>모든 게시글 삭제</button>
      <button onClick={deleteAllPostsAndFiles}>모든 게시글+파일 삭제</button>
    </div>
  );
};

export default CreatePost; 