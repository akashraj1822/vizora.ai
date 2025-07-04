import React, { useState } from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Youtube, Music } from 'lucide-react';
import { SocialPlatform } from '../../types';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

interface ConnectPlatformsProps {
  platforms: SocialPlatform[];
  onConnect: (platform: string) => Promise<void>;
}

export const ConnectPlatforms: React.FC<ConnectPlatformsProps> = ({ platforms, onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platformName: string) => {
    setConnecting(platformName);
    try {
      await onConnect(platformName);
    } finally {
      setConnecting(null);
    }
  };

  const platformIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    pinterest: Instagram, // Using Instagram icon as placeholder
    youtube: Youtube,
    tiktok: Music // Using Music icon as placeholder for TikTok
  };

  const platformColors = {
    instagram: 'from-pink-500 to-yellow-500',
    twitter: 'from-blue-400 to-blue-600',
    linkedin: 'from-blue-600 to-blue-800',
    facebook: 'from-blue-500 to-blue-700',
    pinterest: 'from-red-500 to-red-700',
    youtube: 'from-red-600 to-red-800',
    tiktok: 'from-black to-gray-800'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Your Social Accounts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platformIcons[platform.name];
          const colorClass = platformColors[platform.name];
          
          return (
            <Card key={platform.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{platform.displayName}</h4>
                      {platform.isConnected && platform.username && (
                        <p className="text-sm text-gray-500">{platform.username}</p>
                      )}
                      {platform.isConnected && platform.followers && (
                        <p className="text-xs text-gray-400">{platform.followers.toLocaleString()} followers</p>
                      )}
                    </div>
                  </div>
                  
                  {platform.isConnected ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      loading={connecting === platform.name}
                      onClick={() => handleConnect(platform.name)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};