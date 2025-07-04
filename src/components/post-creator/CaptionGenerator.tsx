import React, { useState } from 'react';
import { Wand2, RefreshCw, Copy, Check, Sparkles, Settings } from 'lucide-react';
import { AICaption } from '../../types';
import { openaiService } from '../../services/openaiService';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

interface CaptionGeneratorProps {
  platforms: string[];
  onCaptionSelect: (caption: string) => void;
  currentContent: string;
  imageDescription?: string;
}

export const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({
  platforms,
  onCaptionSelect,
  currentContent,
  imageDescription
}) => {
  const [captions, setCaptions] = useState<AICaption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'promotional' | 'friendly'>('casual');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [audience, setAudience] = useState('general audience');
  const [keywords, setKeywords] = useState('');
  const [apiConfigured] = useState(openaiService.constructor.isConfigured());

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let generatedCaptions: AICaption[];
      
      if (apiConfigured) {
        // Use OpenAI API
        const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        const options = {
          tone: selectedTone,
          audience,
          keywords: keywordArray,
          maxLength: getMaxLength()
        };

        if (imageDescription) {
          generatedCaptions = await openaiService.generateContentFromImage(
            imageDescription,
            platforms,
            options
          );
        } else {
          generatedCaptions = await openaiService.generateCaptions(
            currentContent || 'Create engaging social media content',
            platforms,
            options
          );
        }
      } else {
        // Fallback to mock captions
        generatedCaptions = generateMockCaptions();
      }
      
      setCaptions(generatedCaptions);
    } catch (error) {
      console.error('Failed to generate captions:', error);
      // Show error message or fallback to mock captions
      setCaptions(generateMockCaptions());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockCaptions = (): AICaption[] => {
    const mockCaptions = [
      {
        id: '1',
        content: selectedTone === 'professional' 
          ? 'Excited to share insights from our latest project. The attention to detail in this design showcases the importance of thoughtful user experience.'
          : selectedTone === 'promotional'
          ? '🔥 Don\'t miss out on this amazing design! Limited time offer - check out our latest collection now!'
          : 'Just finished this beautiful design and I\'m so excited to share it with you all! ✨ What do you think?',
        tone: selectedTone,
        hashtags: ['#design', '#creativity', '#inspiration', '#art', '#ui', '#ux'],
        platform: platforms[0] || 'instagram'
      },
      {
        id: '2',
        content: selectedTone === 'professional'
          ? 'Showcasing innovative design solutions that prioritize user experience and accessibility. Every element serves a purpose.'
          : selectedTone === 'promotional'
          ? '💫 NEW RELEASE ALERT! Get 25% off our premium design templates. Link in bio!'
          : 'When creativity meets functionality 🎨 This project taught me so much about the design process!',
        tone: selectedTone,
        hashtags: ['#designthinking', '#innovation', '#userexperience', '#creative'],
        platform: platforms[0] || 'instagram'
      },
      {
        id: '3',
        content: selectedTone === 'professional'
          ? 'Demonstrating the impact of strategic design decisions on user engagement and business outcomes.'
          : selectedTone === 'promotional'
          ? 'Ready to transform your brand? Our design team is here to help! Book a consultation today.'
          : 'Another day, another design challenge conquered! 💪 Love how this turned out.',
        tone: selectedTone,
        hashtags: ['#branding', '#designstrategy', '#business', '#growth'],
        platform: platforms[0] || 'instagram'
      }
    ];

    return mockCaptions;
  };

  const getMaxLength = () => {
    const limits = {
      twitter: 280,
      instagram: 2200,
      linkedin: 3000,
      facebook: 63206
    };
    
    if (platforms.length === 0) return 280;
    return Math.min(...platforms.map(p => limits[p as keyof typeof limits] || 280));
  };

  const handleCopy = async (caption: string, index: number) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy caption:', error);
    }
  };

  const tones = [
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'promotional', label: 'Promotional', description: 'Sales-focused and engaging' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          AI Caption Generator
          {apiConfigured && <Sparkles className="w-5 h-5 text-green-500 ml-2" />}
        </h3>
        <Button
          icon={apiConfigured ? Sparkles : Wand2}
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={platforms.length === 0}
        >
          {apiConfigured ? 'Generate with AI' : 'Generate Captions'}
        </Button>
      </div>

      {!apiConfigured && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Enhanced AI Features Available</p>
              <p className="text-blue-700 mt-1">
                Configure your OpenAI API key to unlock advanced AI-powered caption generation with custom tones, audiences, and keywords.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options (only show if API is configured) */}
      {apiConfigured && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., young professionals, designers, entrepreneurs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., design, creativity, innovation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Tone Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Tone</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => setSelectedTone(tone.value as any)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedTone === tone.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 text-sm">{tone.label}</div>
              <div className="text-xs text-gray-500">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Generated Captions</h4>
          <div className="space-y-3">
            {captions.map((caption, index) => (
              <Card key={caption.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p className="text-gray-900 leading-relaxed">{caption.content}</p>
                    
                    {caption.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {caption.hashtags.map((hashtag, hashIndex) => (
                          <span
                            key={hashIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {caption.tone}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {caption.platform}
                        </span>
                        {apiConfigured && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={copiedIndex === index ? Check : Copy}
                          onClick={() => handleCopy(caption.content + ' ' + caption.hashtags.join(' '), index)}
                        >
                          {copiedIndex === index ? 'Copied' : 'Copy'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCaptionSelect(caption.content + ' ' + caption.hashtags.join(' '))}
                        >
                          Use This
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {platforms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Select platforms first to generate AI captions
        </div>
      )}
    </div>
  );
};