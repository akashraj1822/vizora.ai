import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Youtube, Music } from 'lucide-react';
import { SocialPlatform } from '../../types';

interface PlatformSelectorProps {
  platforms: SocialPlatform[];
  selectedPlatforms: string[];
  onSelectionChange: (platforms: string[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatforms,
  onSelectionChange
}) => {
  const platformIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    pinterest: Instagram,
    youtube: Youtube,
    tiktok: Music
  };

  const platformColors = {
    instagram: 'border-pink-500 bg-pink-50',
    twitter: 'border-blue-500 bg-blue-50',
    linkedin: 'border-blue-600 bg-blue-50',
    facebook: 'border-blue-500 bg-blue-50',
    pinterest: 'border-red-500 bg-red-50',
    youtube: 'border-red-600 bg-red-50',
    tiktok: 'border-black bg-gray-50'
  };

  const handlePlatformToggle = (platformName: string) => {
    if (selectedPlatforms.includes(platformName)) {
      onSelectionChange(selectedPlatforms.filter(p => p !== platformName));
    } else {
      onSelectionChange([...selectedPlatforms, platformName]);
    }
  };

  const connectedPlatforms = platforms.filter(p => p.isConnected);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Platforms</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {connectedPlatforms.map((platform) => {
          const Icon = platformIcons[platform.name];
          const isSelected = selectedPlatforms.includes(platform.name);
          const colorClass = platformColors[platform.name];
          
          // Fallback to Instagram icon if platform icon is not found
          const IconComponent = Icon || Instagram;
          
          return (
            <button
              key={platform.id}
              onClick={() => handlePlatformToggle(platform.name)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? `${colorClass} shadow-lg` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <IconComponent className={`w-6 h-6 ${isSelected ? 'text-gray-700' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                  {platform.displayName}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {connectedPlatforms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No connected accounts. Please connect your social media accounts first.</p>
        </div>
      )}
    </div>
  );
};