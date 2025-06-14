import React from 'react';
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../ui/Card';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
    };
    createdAt: string;
    likes: number;
    comments: number;
    tags: string[];
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const author = post.author || { name: '알 수 없음', avatar: undefined };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-sm">
                  {author.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{author.name}</h4>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.content}
        </p>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            className={`flex items-center space-x-2 text-sm ${
              post.isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            } transition-colors`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-full ${
              post.isBookmarked
                ? 'text-yellow-600 hover:text-yellow-700 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            } transition-colors`}
          >
            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Share className="w-4 h-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard; 