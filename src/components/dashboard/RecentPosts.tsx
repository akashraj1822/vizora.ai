import React from 'react';
import { Calendar, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '../../types';
import { Card, CardContent, CardHeader } from '../common/Card';

interface RecentPostsProps {
  posts: Post[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {post.media[0] && (
                  <img
                    src={post.media[0].url}
                    alt={post.media[0].alt}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {post.scheduledTime ? formatDate(post.scheduledTime) : formatDate(post.createdAt)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  {post.analytics && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.analytics.reach}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.analytics.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.analytics.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-3 h-3" />
                        <span>{post.analytics.shares}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};