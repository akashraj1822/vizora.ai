export interface PostData {
  content: string;
  media: Array<{ url: string; type: 'image' | 'video' }>;
  platforms: string[];
}

export const socialMediaService = {
  // Generate deep links to social media apps
  generateDeepLinks: (postData: PostData) => {
    const { content, media } = postData;
    const encodedContent = encodeURIComponent(content);
    const firstImageUrl = media.find(m => m.type === 'image')?.url;
    
    return {
      instagram: {
        // Instagram doesn't support direct posting via URL schemes
        // Best we can do is open the app
        mobile: 'instagram://camera',
        web: 'https://www.instagram.com/',
        instructions: 'Instagram will open. Please manually create your post with the prepared content.'
      },
      
      twitter: {
        mobile: `twitter://post?message=${encodedContent}`,
        web: `https://twitter.com/intent/tweet?text=${encodedContent}`,
        instructions: 'Twitter will open with your content pre-filled.'
      },
      
      linkedin: {
        mobile: `linkedin://sharing?text=${encodedContent}`,
        web: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodedContent}`,
        instructions: 'LinkedIn will open with your content ready to share.'
      },
      
      facebook: {
        mobile: `fb://composer?text=${encodedContent}`,
        web: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodedContent}`,
        instructions: 'Facebook will open with your content pre-filled.'
      },
      
      pinterest: {
        mobile: firstImageUrl ? `pinterest://pin?url=${encodeURIComponent(window.location.origin)}&media=${encodeURIComponent(firstImageUrl)}&description=${encodedContent}` : 'pinterest://',
        web: firstImageUrl ? `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin)}&media=${encodeURIComponent(firstImageUrl)}&description=${encodedContent}` : 'https://pinterest.com',
        instructions: 'Pinterest will open with your image and description ready to pin.'
      }
    };
  },

  // Attempt to open social media app/website
  openPlatform: async (platform: string, postData: PostData) => {
    const links = socialMediaService.generateDeepLinks(postData);
    const platformLinks = links[platform as keyof typeof links];
    
    if (!platformLinks) {
      throw new Error(`Platform ${platform} not supported`);
    }

    // Copy content to clipboard for easy pasting
    try {
      await navigator.clipboard.writeText(postData.content);
      console.log('Content copied to clipboard');
    } catch (error) {
      console.warn('Could not copy to clipboard:', error);
    }

    // Try to detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try mobile deep link first
      const link = document.createElement('a');
      link.href = platformLinks.mobile;
      link.click();
      
      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(platformLinks.web, '_blank');
      }, 1000);
    } else {
      // Desktop - open web version
      window.open(platformLinks.web, '_blank');
    }

    return {
      success: true,
      instructions: platformLinks.instructions,
      contentCopied: true
    };
  },

  // Prepare content for manual posting
  prepareContentForManualPost: (postData: PostData) => {
    const { content, media } = postData;
    
    return {
      text: content,
      mediaCount: media.length,
      mediaTypes: media.map(m => m.type),
      hashtags: content.match(/#\w+/g) || [],
      mentions: content.match(/@\w+/g) || [],
      instructions: [
        '1. Your content has been copied to clipboard',
        '2. The social media app/website will open',
        '3. Paste your content and add your media',
        '4. Review and publish your post'
      ]
    };
  }
};