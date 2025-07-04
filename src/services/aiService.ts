import { AICaption } from '../types';
import { openaiService } from './openaiService';

// Legacy service that now uses OpenAI service as primary with fallback
export const generateCaptions = async (
  content: string, 
  platforms: string[], 
  tone: 'professional' | 'casual' | 'promotional' = 'casual'
): Promise<AICaption[]> => {
  try {
    // Try OpenAI service first if configured
    if (openaiService.isConfigured()) {
      return await openaiService.generateCaptions(content, platforms, { tone });
    }
  } catch (error) {
    console.warn('OpenAI service failed, falling back to mock data:', error);
  }

  // Fallback to mock AI caption generation
  await new Promise(resolve => setTimeout(resolve, 2000));

  const mockCaptions: AICaption[] = [
    {
      id: '1',
      content: tone === 'professional' 
        ? 'Excited to share insights from our latest project. The attention to detail in this design showcases the importance of thoughtful user experience.'
        : tone === 'promotional'
        ? '🔥 Don\'t miss out on this amazing design! Limited time offer - check out our latest collection now!'
        : 'Just finished this beautiful design and I\'m so excited to share it with you all! ✨ What do you think?',
      tone,
      hashtags: ['#design', '#creativity', '#inspiration', '#art', '#ui', '#ux'],
      platform: 'instagram'
    },
    {
      id: '2',
      content: tone === 'professional'
        ? 'Showcasing innovative design solutions that prioritize user experience and accessibility. Every element serves a purpose.'
        : tone === 'promotional'
        ? '💫 NEW RELEASE ALERT! Get 25% off our premium design templates. Link in bio!'
        : 'When creativity meets functionality 🎨 This project taught me so much about the design process!',
      tone,
      hashtags: ['#designthinking', '#innovation', '#userexperience', '#creative'],
      platform: 'instagram'
    },
    {
      id: '3',
      content: tone === 'professional'
        ? 'Demonstrating the impact of strategic design decisions on user engagement and business outcomes.'
        : tone === 'promotional'
        ? 'Ready to transform your brand? Our design team is here to help! Book a consultation today.'
        : 'Another day, another design challenge conquered! 💪 Love how this turned out.',
      tone,
      hashtags: ['#branding', '#designstrategy', '#business', '#growth'],
      platform: 'linkedin'
    }
  ];

  return mockCaptions;
};

export const getOptimalPostTimes = async (platform: string): Promise<string[]> => {
  try {
    // Try OpenAI service first if configured
    if (openaiService.isConfigured()) {
      const timings = await openaiService.optimizePostTiming([platform]);
      return timings[platform] || [];
    }
  } catch (error) {
    console.warn('OpenAI timing optimization failed, using defaults:', error);
  }

  // Fallback to mock optimal posting times
  await new Promise(resolve => setTimeout(resolve, 1000));

  const times = {
    instagram: ['9:00 AM', '1:00 PM', '5:00 PM', '7:00 PM'],
    twitter: ['8:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
    linkedin: ['9:00 AM', '12:00 PM', '2:00 PM', '5:00 PM'],
    facebook: ['9:00 AM', '1:00 PM', '3:00 PM', '7:00 PM'],
    pinterest: ['8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM']
  };

  return times[platform as keyof typeof times] || times.instagram;
};