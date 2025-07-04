import { useState, useEffect } from 'react';
import { Post, PostAnalytics } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock posts data
    const mockPosts: Post[] = [
      {
        id: '1',
        content: 'Excited to share my latest design project! 🎨 What do you think about this color palette? #design #creativity #ui',
        platforms: ['instagram', 'twitter'],
        media: [{
          id: '1',
          type: 'image',
          url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
          alt: 'Design mockup'
        }],
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled',
        createdAt: new Date(),
        analytics: {
          engagement: 156,
          reach: 2340,
          clicks: 89,
          shares: 23,
          comments: 45,
          likes: 134
        }
      },
      {
        id: '2',
        content: 'Behind the scenes of our creative process. Sometimes the best ideas come from unexpected moments! ✨',
        platforms: ['instagram', 'linkedin'],
        media: [{
          id: '2',
          type: 'image',
          url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
          alt: 'Creative workspace'
        }],
        status: 'published',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        analytics: {
          engagement: 245,
          reach: 3200,
          clicks: 120,
          shares: 34,
          comments: 67,
          likes: 198
        }
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 500);
  }, []);

  const createPost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content: postData.content || '',
      platforms: postData.platforms || [],
      media: postData.media || [],
      scheduledTime: postData.scheduledTime,
      status: 'draft',
      createdAt: new Date(),
      ...postData
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return { posts, isLoading, createPost, updatePost, deletePost };
};