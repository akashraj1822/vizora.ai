export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  connectedPlatforms: SocialPlatform[];
  isAuthenticated: boolean;
}

export interface SocialPlatform {
  id: string;
  name: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'youtube' | 'tiktok';
  displayName: string;
  isConnected: boolean;
  username?: string;
  followers?: number;
  avatar?: string;
  connectionDate?: Date;
}

export interface Post {
  id: string;
  content: string;
  platforms: string[];
  media: MediaItem[];
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  createdAt: Date;
  analytics?: PostAnalytics;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
  size?: number;
}

export interface PostAnalytics {
  engagement: number;
  reach: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
}

export interface AICaption {
  id: string;
  content: string;
  tone: 'professional' | 'casual' | 'promotional';
  hashtags: string[];
  platform: string;
}

export interface ScheduleSlot {
  date: Date;
  time: string;
  isOptimal: boolean;
  posts: Post[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'post' | 'reminder' | 'campaign';
  platforms: string[];
  status: 'scheduled' | 'published' | 'draft';
}