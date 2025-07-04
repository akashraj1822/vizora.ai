import { useState, useEffect } from 'react';
import { User, SocialPlatform } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('vizora_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    if (email === 'demo@vizora.com' && password === 'password123') {
      const mockUser: User = {
        id: '1',
        name: 'Sarah Johnson',
        email: 'demo@vizora.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        isAuthenticated: true,
        connectedPlatforms: [
          {
            id: '1',
            name: 'instagram',
            displayName: 'Instagram',
            isConnected: true,
            username: '@sarah.creates',
            followers: 12500,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
            connectionDate: new Date()
          },
          {
            id: '2',
            name: 'twitter',
            displayName: 'X (Twitter)',
            isConnected: true,
            username: '@sarahcreates',
            followers: 8200,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
            connectionDate: new Date()
          },
          {
            id: '3',
            name: 'linkedin',
            displayName: 'LinkedIn',
            isConnected: false,
            username: undefined,
            followers: 0
          },
          {
            id: '4',
            name: 'facebook',
            displayName: 'Facebook',
            isConnected: false,
            username: undefined,
            followers: 0
          },
          {
            id: '5',
            name: 'youtube',
            displayName: 'YouTube',
            isConnected: false,
            username: undefined,
            followers: 0
          },
          {
            id: '6',
            name: 'tiktok',
            displayName: 'TikTok',
            isConnected: false,
            username: undefined,
            followers: 0
          }
        ]
      };

      localStorage.setItem('vizora_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const connectPlatform = async (platform: string) => {
    // Mock OAuth connection
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedPlatforms = user.connectedPlatforms.map(p => 
            p.name === platform 
              ? { 
                  ...p, 
                  isConnected: true, 
                  username: `@${user.name.toLowerCase().replace(' ', '')}`,
                  followers: Math.floor(Math.random() * 10000) + 1000,
                  connectionDate: new Date()
                }
              : p
          );
          const updatedUser = { ...user, connectedPlatforms: updatedPlatforms };
          setUser(updatedUser);
          localStorage.setItem('vizora_user', JSON.stringify(updatedUser));
        }
        resolve(true);
      }, 2000);
    });
  };

  const logout = () => {
    localStorage.removeItem('vizora_user');
    setUser(null);
  };

  return { user, isLoading, login, connectPlatform, logout };
};