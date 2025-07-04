import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Smartphone, Globe, AlertCircle, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';
import { socialMediaService, PostData } from '../../services/socialMediaService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  postData: PostData;
  selectedPlatforms: string[];
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  postData,
  selectedPlatforms
}) => {
  const [publishingPlatforms, setPublishingPlatforms] = useState<string[]>([]);
  const [publishedPlatforms, setPublishedPlatforms] = useState<string[]>([]);
  const [contentCopied, setContentCopied] = useState(false);

  const platformIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    pinterest: Instagram
  };

  const platformColors = {
    instagram: 'from-pink-500 to-yellow-500',
    twitter: 'from-blue-400 to-blue-600',
    linkedin: 'from-blue-600 to-blue-800',
    facebook: 'from-blue-500 to-blue-700',
    pinterest: 'from-red-500 to-red-700'
  };

  const handlePublishToPlatform = async (platform: string) => {
    setPublishingPlatforms(prev => [...prev, platform]);
    
    try {
      const result = await socialMediaService.openPlatform(platform, postData);
      
      if (result.success) {
        setPublishedPlatforms(prev => [...prev, platform]);
        if (result.contentCopied) {
          setContentCopied(true);
          setTimeout(() => setContentCopied(false), 3000);
        }
      }
    } catch (error) {
      console.error(`Failed to open ${platform}:`, error);
      alert(`Failed to open ${platform}. Please try again.`);
    } finally {
      setPublishingPlatforms(prev => prev.filter(p => p !== platform));
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(postData.content);
      setContentCopied(true);
      setTimeout(() => setContentCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Publish to Social Media</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
          <p className="text-gray-600 mt-2">
            Click on each platform to open the app/website and post your content.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Content Preview */}
          <Card className="bg-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Your Content</h4>
                <Button
                  variant="outline"
                  size="sm"
                  icon={contentCopied ? Check : Copy}
                  onClick={handleCopyContent}
                >
                  {contentCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{postData.content}</p>
              {postData.media.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {postData.media.length} media file{postData.media.length > 1 ? 's' : ''} to upload manually
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {postData.media.slice(0, 4).map((media, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={media.url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Publishing */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Publish to Platforms</h4>
            
            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">How this works:</p>
                  <ul className="mt-2 space-y-1 text-yellow-700">
                    <li>• Your content is copied to clipboard automatically</li>
                    <li>• Each platform opens in a new tab/app</li>
                    <li>• Paste your content and upload media manually</li>
                    <li>• Some platforms may require you to recreate the post</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {selectedPlatforms.map((platform) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons] || Instagram;
                const colorClass = platformColors[platform as keyof typeof platformColors];
                const isPublishing = publishingPlatforms.includes(platform);
                const isPublished = publishedPlatforms.includes(platform);
                
                return (
                  <Card key={platform} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 capitalize">{platform}</h5>
                            <p className="text-sm text-gray-500">
                              {isPublished ? 'Opened successfully' : 'Ready to publish'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isPublished && (
                            <div className="flex items-center text-green-600">
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-sm">Opened</span>
                            </div>
                          )}
                          
                          <Button
                            variant={isPublished ? "outline" : "primary"}
                            size="sm"
                            loading={isPublishing}
                            onClick={() => handlePublishToPlatform(platform)}
                            icon={ExternalLink}
                          >
                            {isPublished ? 'Open Again' : 'Open & Post'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h5 className="font-medium text-blue-900 mb-2">Publishing Instructions</h5>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Open & Post" for each platform</li>
                <li>2. The app/website will open in a new tab</li>
                <li>3. Your content is automatically copied to clipboard</li>
                <li>4. Paste the content and upload your media files</li>
                <li>5. Review and publish your post on each platform</li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                selectedPlatforms.forEach(platform => {
                  setTimeout(() => handlePublishToPlatform(platform), 500);
                });
              }}
              disabled={publishingPlatforms.length > 0}
            >
              Open All Platforms
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};