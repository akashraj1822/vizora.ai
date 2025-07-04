import OpenAI from 'openai';

// Initialize OpenAI client with proper error handling
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not configured. AI features will use demo mode.');
    return null;
  }
  
  try {
    return new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    return null;
  }
};

const openai = getOpenAIClient();

export const openaiService = {
  isConfigured: () => !!openai,

  async generateCaption(
    content: string,
    platforms: string[],
    tone: 'professional' | 'casual' | 'promotional' = 'casual',
    audience?: string,
    keywords?: string[]
  ): Promise<string> {
    if (!openai) {
      // Fallback to demo content when API is not configured
      const demoResponses = {
        professional: "Excited to share insights from our latest project. The attention to detail in this design showcases the importance of thoughtful user experience. #design #innovation #userexperience",
        casual: "Just finished this beautiful design and I'm so excited to share it with you all! ✨ What do you think? #design #creativity #inspiration",
        promotional: "🔥 Don't miss out on this amazing design! Limited time offer - check out our latest collection now! #sale #design #limitedtime"
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return demoResponses[tone];
    }

    try {
      const platformText = platforms.length > 0 ? platforms.join(', ') : 'social media';
      const audienceText = audience ? ` for ${audience}` : '';
      const keywordText = keywords && keywords.length > 0 ? ` Include these keywords: ${keywords.join(', ')}.` : '';
      
      const prompt = `Create a ${tone} social media caption for ${platformText}${audienceText}. 
      
      Content context: ${content}
      
      Requirements:
      - Tone: ${tone}
      - Platform(s): ${platformText}
      - Include relevant hashtags
      - Keep it engaging and authentic
      ${keywordText}
      
      Return only the caption text with hashtags.`;

      const response = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a social media expert who creates engaging, authentic captions that drive engagement. Always include relevant hashtags and maintain the requested tone.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '500'),
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7')
      });

      return response.choices[0]?.message?.content || 'Unable to generate caption. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate caption. Please check your API configuration.');
    }
  },

  async generateHashtags(content: string, platform: string): Promise<string[]> {
    if (!openai) {
      // Fallback hashtags
      return ['#design', '#creativity', '#inspiration', '#art', '#digital'];
    }

    try {
      const response = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Generate relevant hashtags for ${platform}. Return only hashtags separated by commas, no other text.`
          },
          {
            role: 'user',
            content: `Generate 5-8 relevant hashtags for this content: ${content}`
          }
        ],
        max_tokens: 100,
        temperature: 0.5
      });

      const hashtagText = response.choices[0]?.message?.content || '';
      return hashtagText.split(',').map(tag => tag.trim()).filter(tag => tag.startsWith('#'));
    } catch (error) {
      console.error('OpenAI API error:', error);
      return ['#content', '#social', '#media'];
    }
  },

  async chatCompletion(messages: Array<{role: string, content: string}>): Promise<string> {
    if (!openai) {
      // Fallback responses for demo mode
      const demoResponses = [
        "I'd be happy to help you with that! Here are some suggestions based on current trends...",
        "Great question! Let me analyze your content performance and provide some insights.",
        "I can help you create engaging content for that topic. Here's what I recommend...",
        "Based on your audience data, here are the optimal times to post...",
        "Let me generate some caption ideas for your next post. What's the main theme?",
        "I notice your engagement is highest on visual content. Would you like me to suggest some image ideas?"
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return demoResponses[Math.floor(Math.random() * demoResponses.length)];
    }

    try {
      const response = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Vizora AI, a helpful assistant specialized in social media management, content creation, and digital marketing. Provide practical, actionable advice to help users grow their social media presence.'
          },
          ...messages
        ],
        max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '1000'),
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7')
      });

      return response.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response. Please check your API configuration.');
    }
  },

  async analyzeImage(imageUrl: string): Promise<string> {
    if (!openai) {
      // Fallback image analysis
      const demoAnalyses = [
        "This image shows great composition with vibrant colors that would work well for social media engagement.",
        "The visual elements in this image suggest themes of creativity and innovation - perfect for design-focused content.",
        "This image has strong visual appeal with good lighting and composition that should perform well across platforms."
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      return demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)];
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for social media content creation. Describe what you see and suggest content themes, mood, and potential caption ideas.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      return response.choices[0]?.message?.content || 'Unable to analyze image.';
    } catch (error) {
      console.error('OpenAI Vision API error:', error);
      return 'Image analysis not available. Please try again later.';
    }
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!openai) {
      return {
        success: false,
        message: 'OpenAI API key not configured. Please add your API key in the settings.'
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Test connection - respond with "Connection successful"'
          }
        ],
        max_tokens: 10
      });

      if (response.choices[0]?.message?.content) {
        return {
          success: true,
          message: 'OpenAI API connection successful!'
        };
      } else {
        return {
          success: false,
          message: 'Unexpected response from OpenAI API.'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message || 'Unknown error'}`
      };
    }
  }
};