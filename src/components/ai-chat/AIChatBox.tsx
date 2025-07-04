import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown, Settings, Zap } from 'lucide-react';
import { ChatMessage } from '../../types';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';
import { openaiService } from '../../services/openaiService';

interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatBox: React.FC<AIChatBoxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant powered by OpenAI. I can help you create engaging content, suggest optimal posting times, analyze your performance, generate captions, and much more. What would you like to work on today? 🚀",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [apiConfigured, setApiConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiConfigured(openaiService.isConfigured());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      let aiResponse: string;
      
      if (apiConfigured) {
        // Use OpenAI API
        aiResponse = await openaiService.chatCompletion([...conversationHistory, { role: 'user', content: currentInput }]);
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: currentInput },
          { role: 'assistant', content: aiResponse }
        ]);
      } else {
        // Fallback to mock responses
        aiResponse = generateMockResponse(currentInput);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please check your API configuration or try again later. 🔧",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      "I'd be happy to help you with that! Here are some suggestions based on current trends...",
      "Great question! Let me analyze your content performance and provide some insights.",
      "I can help you create engaging content for that topic. Here's what I recommend...",
      "Based on your audience data, here are the optimal times to post...",
      "Let me generate some caption ideas for your next post. What's the main theme?",
      "I notice your engagement is highest on visual content. Would you like me to suggest some image ideas?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const quickPrompts = [
    "Help me create a post about productivity tips",
    "What are the best times to post today?",
    "Analyze my recent post performance",
    "Generate hashtags for my content",
    "Suggest content ideas for this week",
    "How can I improve my engagement rate?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/Visora 1.png" 
                alt="Vizora AI" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                AI Assistant
                {apiConfigured && <Zap className="w-4 h-4 text-green-500 ml-2" />}
              </h3>
              <p className="text-sm text-gray-500">
                {apiConfigured ? 'Powered by OpenAI' : 'Demo mode - Configure API key for full features'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!apiConfigured && (
              <Button variant="ghost" size="sm" icon={Settings} title="API not configured">
                Setup
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* API Configuration Notice */}
        {!apiConfigured && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">OpenAI API Not Configured</p>
                <p className="text-yellow-700 mt-1">
                  Add your OpenAI API key to <code className="bg-yellow-200 px-1 rounded">.env</code> file as <code className="bg-yellow-200 px-1 rounded">VITE_OPENAI_API_KEY</code> for full AI features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-500'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'ai' && (
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Good response"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Poor response"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask me anything about your social media strategy..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              icon={Send}
              size="sm"
            >
              Send
            </Button>
          </div>
          
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {quickPrompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(prompt)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                disabled={isTyping}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};