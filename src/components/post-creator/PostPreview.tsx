import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { MediaItem } from '../../types';

interface PostPreviewProps {
  platforms: string[];
  content: string;
  media: MediaItem[];
  username: string;
  userAvatar: string;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  platforms,
  content,
  media,
  username,
  userAvatar
}) => {
  const platformIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    pinterest: Instagram,
    youtube: Instagram,
    tiktok: Instagram
  };

  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 p-3 border-b border-gray-100">
        <img src={userAvatar} alt="User" className="w-8 h-8 rounded-full" />
        <span className="font-semibold text-sm">{username}</span>
      </div>
      
      {/* Media */}
      {media[0] && (
        <div className="aspect-square bg-gray-100">
          <img src={media[0].url} alt={media[0].alt} className="w-full h-full object-cover" />
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Share2 className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
      </div>
      
      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-sm">
          <span className="font-semibold">{username}</span> {content}
        </p>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-lg mx-auto p-4">
      <div className="flex space-x-3">
        <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-bold text-sm">Sarah Johnson</span>
            <span className="text-gray-500 text-sm">{username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">2m</span>
          </div>
          <p className="text-sm mb-3">{content}</p>
          {media[0] && (
            <div className="rounded-lg overflow-hidden mb-3">
              <img src={media[0].url} alt={media[0].alt} className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between text-gray-500 max-w-md">
            <MessageCircle className="w-4 h-4" />
            <Share2 className="w-4 h-4" />
            <Heart className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-lg mx-auto">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-sm">Sarah Johnson</div>
            <div className="text-gray-500 text-xs">Creative Director at Design Studio</div>
            <div className="text-gray-500 text-xs">2m</div>
          </div>
        </div>
        <p className="text-sm mb-3">{content}</p>
      </div>
      {media[0] && (
        <div className="bg-gray-100">
          <img src={media[0].url} alt={media[0].alt} className="w-full h-64 object-cover" />
        </div>
      )}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <Heart className="w-4 h-4" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <MessageCircle className="w-4 h-4" />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-600">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const previews = {
    instagram: renderInstagramPreview,
    twitter: renderTwitterPreview,
    linkedin: renderLinkedInPreview,
    facebook: renderTwitterPreview,
    pinterest: renderInstagramPreview,
    youtube: renderInstagramPreview,
    tiktok: renderInstagramPreview
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Preview</h3>
      
      {platforms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Select platforms to see preview
        </div>
      ) : (
        <div className="space-y-8">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform as keyof typeof platformIcons];
            const renderPreview = previews[platform as keyof typeof previews];
            
            return (
              <div key={platform} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium capitalize">{platform}</span>
                </div>
                {renderPreview()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};