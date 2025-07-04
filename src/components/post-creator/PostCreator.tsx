import React, { useState } from 'react';
import { Calendar, Send, Save, ArrowLeft, ArrowRight, Sparkles, Camera, Image as ImageIcon, Clock, Users, Eye, Share2, CheckCircle, AlertCircle, TrendingUp, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { MediaItem } from '../../types';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';
import { PlatformSelector } from './PlatformSelector';
import { MediaUpload } from './MediaUpload';
import { CaptionGenerator } from './CaptionGenerator';
import { PostPreview } from './PostPreview';
import { PublishModal } from './PublishModal';

interface PostCreatorProps {
  onClose: () => void;
}

export const PostCreator: React.FC<PostCreatorProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [scheduledTime, setScheduledTime] = useState<Date | undefined>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const steps = [
    { id: 1, title: 'Platforms', description: 'Choose where to post' },
    { id: 2, title: 'Content', description: 'Create your post' },
    { id: 3, title: 'Schedule', description: 'Choose when to publish' },
    { id: 4, title: 'Review', description: 'Preview and confirm' }
  ];

  const handlePublish = async (isDraft = false) => {
    if (!user) return;
    
    // If publishing now (not draft and not scheduled), show the publish modal
    if (!isDraft && !scheduledTime) {
      setShowPublishModal(true);
      return;
    }
    
    setIsPublishing(true);
    try {
      const post = createPost({
        content,
        platforms: selectedPlatforms,
        media,
        scheduledTime,
        status: isDraft ? 'draft' : scheduledTime ? 'scheduled' : 'published'
      });
      
      // Simulate API call for drafts and scheduled posts
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onClose();
    } catch (error) {
      console.error('Failed to publish post:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateAIContent = async () => {
    if (media.length === 0) {
      alert('Please add some media first to generate AI content based on your images.');
      return;
    }

    setIsGeneratingContent(true);
    try {
      // Simulate AI content generation based on images
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiGeneratedContent = [
        "✨ Excited to share this beautiful moment! The colors and composition in this shot really capture the essence of creativity. What do you think? #photography #creative #inspiration",
        "🎨 Sometimes the best art comes from unexpected moments. This image tells a story that words alone cannot express. #art #storytelling #visual",
        "🌟 Capturing life's beautiful details, one frame at a time. There's something magical about freezing a perfect moment forever. #moments #beauty #life"
      ];
      
      const randomContent = aiGeneratedContent[Math.floor(Math.random() * aiGeneratedContent.length)];
      setContent(randomContent);
    } catch (error) {
      console.error('Failed to generate AI content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      
      // Create a video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      
      // Create a modal for camera interface
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="relative">
          <video autoplay playsinline class="max-w-full max-h-full"></video>
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button id="capture-btn" class="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors"></button>
            <button id="close-camera" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Close</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      const modalVideo = modal.querySelector('video') as HTMLVideoElement;
      modalVideo.srcObject = stream;
      
      // Handle capture
      modal.querySelector('#capture-btn')?.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = modalVideo.videoWidth;
        canvas.height = modalVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(modalVideo, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = (e) => {
              const newMedia: MediaItem = {
                id: Date.now().toString(),
                type: 'image',
                url: e.target?.result as string,
                alt: 'Camera capture',
                size: blob.size
              };
              setMedia(prev => [...prev, newMedia]);
            };
            reader.readAsDataURL(file);
          }
        }, 'image/jpeg', 0.9);
        
        // Close camera
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      });
      
      // Handle close
      modal.querySelector('#close-camera')?.addEventListener('click', () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      });
      
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Camera access failed. Please check your permissions.');
    }
  };

  const handleGalleryAccess = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const mediaItem: MediaItem = {
              id: Date.now().toString() + index,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              url: e.target?.result as string,
              alt: file.name,
              size: file.size
            };
            setMedia(prev => [...prev, mediaItem]);
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const getCharacterLimit = (platform: string) => {
    const limits = {
      twitter: 280,
      instagram: 2200,
      linkedin: 3000,
      facebook: 63206,
      pinterest: 500
    };
    return limits[platform as keyof typeof limits] || 280;
  };

  const getMinCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 2200;
    return Math.min(...selectedPlatforms.map(getCharacterLimit));
  };

  const characterLimit = getMinCharacterLimit();
  const isOverLimit = content.length > characterLimit;

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedPlatforms.length > 0;
      case 2: return content.trim() && !isOverLimit;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  // Calculate estimated reach and engagement
  const getEstimatedMetrics = () => {
    const connectedPlatforms = user?.connectedPlatforms.filter(p => 
      selectedPlatforms.includes(p.name) && p.isConnected
    ) || [];
    
    const totalFollowers = connectedPlatforms.reduce((sum, platform) => sum + (platform.followers || 0), 0);
    const estimatedReach = Math.floor(totalFollowers * 0.15); // 15% reach rate
    const estimatedEngagement = Math.floor(estimatedReach * 0.08); // 8% engagement rate
    const estimatedLikes = Math.floor(estimatedEngagement * 0.7); // 70% of engagement as likes
    const estimatedComments = Math.floor(estimatedEngagement * 0.2); // 20% as comments
    const estimatedShares = Math.floor(estimatedEngagement * 0.1); // 10% as shares
    
    return { 
      estimatedReach, 
      estimatedEngagement, 
      totalFollowers,
      estimatedLikes,
      estimatedComments,
      estimatedShares
    };
  };

  const { estimatedReach, estimatedEngagement, totalFollowers, estimatedLikes, estimatedComments, estimatedShares } = getEstimatedMetrics();

  // Get content quality score
  const getContentQualityScore = () => {
    let score = 0;
    let feedback = [];

    // Content length check
    if (content.length > 50 && content.length <= characterLimit) {
      score += 25;
    } else if (content.length <= 50) {
      feedback.push("Consider adding more descriptive content");
    }

    // Media check
    if (media.length > 0) {
      score += 30;
    } else {
      feedback.push("Adding media can increase engagement by 50%");
    }

    // Hashtag check
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount >= 3 && hashtagCount <= 10) {
      score += 20;
    } else if (hashtagCount < 3) {
      feedback.push("Add 3-5 relevant hashtags to increase discoverability");
    }

    // Platform optimization
    if (selectedPlatforms.length > 1) {
      score += 15;
    }

    // Engagement elements (questions, calls to action)
    if (content.includes('?') || content.toLowerCase().includes('what do you think') || content.toLowerCase().includes('comment below')) {
      score += 10;
    } else {
      feedback.push("Ask a question to encourage engagement");
    }

    return { score, feedback };
  };

  const { score: qualityScore, feedback: qualityFeedback } = getContentQualityScore();

  if (!user) return null;

  const postData = {
    content,
    media: media.map(m => ({ url: m.url, type: m.type })),
    platforms: selectedPlatforms
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onClose} />
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => handlePublish(true)} disabled={isPublishing}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  onClick={() => handlePublish(false)}
                  loading={isPublishing}
                  disabled={!content.trim() || selectedPlatforms.length === 0 || isOverLimit}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {scheduledTime ? 'Schedule' : 'Publish Now'}
                </Button>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        currentStep >= step.id 
                          ? 'bg-purple-600 text-white shadow-lg' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.id}
                      </div>
                      <div className="hidden md:block">
                        <div className="text-sm font-medium text-gray-900">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 transition-all duration-300 ${
                        currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Panel - Creation */}
              <div className="p-6 border-r border-gray-200 overflow-y-auto max-h-full">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <PlatformSelector
                      platforms={user.connectedPlatforms}
                      selectedPlatforms={selectedPlatforms}
                      onSelectionChange={setSelectedPlatforms}
                    />
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Write Your Post</h3>
                        <div className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                          {content.length}/{characterLimit}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="What's on your mind?"
                          className={`w-full h-32 p-4 pr-16 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                            isOverLimit ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        
                        {/* AI Content Generator Button */}
                        <button
                          onClick={handleGenerateAIContent}
                          disabled={isGeneratingContent || media.length === 0}
                          className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                          title="Generate AI content based on your images"
                        >
                          {isGeneratingContent ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          ) : (
                            <img 
                              src="/Visora 1.png" 
                              alt="AI" 
                              className="w-6 h-6 object-contain"
                            />
                          )}
                        </button>
                      </div>
                      
                      {isOverLimit && (
                        <p className="text-sm text-red-600">
                          Content exceeds character limit for selected platforms
                        </p>
                      )}
                    </div>
                    
                    {/* Camera and Gallery Buttons */}
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        icon={Camera}
                        onClick={handleCameraAccess}
                        className="flex-1"
                      >
                        Camera
                      </Button>
                      <Button
                        variant="outline"
                        icon={ImageIcon}
                        onClick={handleGalleryAccess}
                        className="flex-1"
                      >
                        Gallery
                      </Button>
                    </div>
                    
                    <MediaUpload media={media} onMediaChange={setMedia} />
                    
                    <CaptionGenerator
                      platforms={selectedPlatforms}
                      onCaptionSelect={setContent}
                      currentContent={content}
                    />
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Schedule Your Post</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          id="now"
                          name="schedule"
                          checked={!scheduledTime}
                          onChange={() => setScheduledTime(undefined)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="now" className="text-sm font-medium text-gray-900">
                          Publish Now
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          id="schedule"
                          name="schedule"
                          checked={!!scheduledTime}
                          onChange={() => setScheduledTime(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="schedule" className="text-sm font-medium text-gray-900">
                          Schedule for Later
                        </label>
                      </div>
                      
                      {scheduledTime && (
                        <div className="ml-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              value={scheduledTime.toISOString().slice(0, 16)}
                              onChange={(e) => setScheduledTime(new Date(e.target.value))}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                Optimal Posting Times
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-blue-800">
                              <p>Instagram: 9:00 AM, 1:00 PM, 5:00 PM</p>
                              <p>Twitter: 8:00 AM, 12:00 PM, 6:00 PM</p>
                              <p>LinkedIn: 9:00 AM, 12:00 PM, 5:00 PM</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Review & Publish</h3>
                    
                    {/* Content Quality Score */}
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium flex items-center">
                            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                            Content Quality Score
                          </h4>
                          <div className="flex items-center space-x-2">
                            <div className={`text-2xl font-bold ${
                              qualityScore >= 80 ? 'text-green-600' : 
                              qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {qualityScore}%
                            </div>
                            <div className={`w-3 h-3 rounded-full ${
                              qualityScore >= 80 ? 'bg-green-500' : 
                              qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {qualityFeedback.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Suggestions to improve:</p>
                            <ul className="space-y-1">
                              {qualityFeedback.map((feedback, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-yellow-500 mr-2">•</span>
                                  {feedback}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {qualityScore >= 80 && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Great! Your content is optimized for engagement</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Estimated Performance */}
                    <Card>
                      <CardHeader>
                        <h4 className="font-medium flex items-center">
                          <Eye className="w-5 h-5 text-blue-600 mr-2" />
                          Estimated Performance
                        </h4>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{totalFollowers.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 flex items-center justify-center">
                              <Users className="w-3 h-3 mr-1" />
                              Total Audience
                            </div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">{estimatedReach.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 flex items-center justify-center">
                              <Eye className="w-3 h-3 mr-1" />
                              Estimated Reach
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-red-50 rounded">
                            <div className="text-lg font-bold text-red-600">{estimatedLikes.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 flex items-center justify-center">
                              <Heart className="w-3 h-3 mr-1" />
                              Likes
                            </div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{estimatedComments.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 flex items-center justify-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Comments
                            </div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">{estimatedShares.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 flex items-center justify-center">
                              <Share2 className="w-3 h-3 mr-1" />
                              Shares
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-500 text-center">
                          *Estimates based on your historical performance and current audience
                        </div>
                      </CardContent>
                    </Card>

                    {/* Post Summary */}
                    <Card>
                      <CardHeader>
                        <h4 className="font-medium flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          Post Summary
                        </h4>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Platforms:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPlatforms.map(platform => (
                              <span key={platform} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs rounded-full capitalize font-medium">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-700">Content Preview:</span>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg border max-h-20 overflow-y-auto">
                            <p className="text-sm text-gray-900">{content}</p>
                          </div>
                        </div>
                        
                        {media.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Media:</span>
                            <div className="mt-2 grid grid-cols-4 gap-2">
                              {media.slice(0, 4).map((item, index) => (
                                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={item.url}
                                    alt={item.alt}
                                    className="w-full h-full object-cover"
                                  />
                                  {media.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">+{media.length - 4}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-sm font-medium text-gray-700">Schedule:</span>
                          <div className="mt-1 flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-900">
                              {scheduledTime 
                                ? `Scheduled for ${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString()}`
                                : 'Publish immediately'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Final Publish Options */}
                    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h4 className="text-lg font-semibold text-gray-900">Ready to Publish?</h4>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            Your post will be published to {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} 
                            {scheduledTime ? ` on ${scheduledTime.toLocaleDateString()}` : ' immediately'}.
                          </p>
                          
                          <div className="flex space-x-3 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => handlePublish(true)}
                              disabled={isPublishing}
                              icon={Save}
                            >
                              Save as Draft
                            </Button>
                            <Button
                              onClick={() => handlePublish(false)}
                              loading={isPublishing}
                              disabled={!content.trim() || selectedPlatforms.length === 0 || isOverLimit}
                              icon={Send}
                              className="px-8"
                            >
                              {scheduledTime ? 'Schedule Post' : 'Publish Now'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              {/* Right Panel - Preview */}
              <div className="p-6 bg-gray-50 overflow-y-auto max-h-full">
                <PostPreview
                  platforms={selectedPlatforms}
                  content={content}
                  media={media}
                  username={user.name}
                  userAvatar={user.avatar || ''}
                />
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-gray-200 p-6 flex-shrink-0">
            <div className="flex justify-between">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 4 && (
                <Button
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={!canProceedToNext()}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        postData={postData}
        selectedPlatforms={selectedPlatforms}
      />
    </>
  );
};