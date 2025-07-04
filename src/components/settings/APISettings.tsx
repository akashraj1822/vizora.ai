import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';
import { openaiService } from '../../services/openaiService';

export const APISettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if API key is already configured
    setIsConfigured(openaiService.constructor.isConfigured());
    if (isConfigured) {
      setApiKey('sk-••••••••••••••••••••••••••••••••••••••••••••••••••');
    }
  }, [isConfigured]);

  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.startsWith('sk-••••')) return;
    
    // In a real app, you'd save this securely
    // For demo purposes, we'll just show how it would work
    localStorage.setItem('openai_api_key', apiKey);
    setIsConfigured(true);
    alert('API key saved! Please refresh the page for changes to take effect.');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      const isConnected = await openaiService.testConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConfigured(false);
    setConnectionStatus('idle');
    alert('API key removed! Please refresh the page for changes to take effect.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">OpenAI API Configuration</h3>
        <p className="text-gray-600 mb-6">
          Configure your OpenAI API key to unlock advanced AI features including intelligent content generation, 
          smart caption creation, and personalized recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">API Key</h4>
            {isConfigured && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Configured</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey || apiKey.startsWith('sk-••••')}
            >
              Save API Key
            </Button>
            
            {isConfigured && (
              <>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  loading={isTestingConnection}
                >
                  Test Connection
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleRemoveApiKey}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Remove
                </Button>
              </>
            )}
          </div>

          {/* Connection Status */}
          {connectionStatus !== 'idle' && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              connectionStatus === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {connectionStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {connectionStatus === 'success' 
                  ? 'Connection successful! AI features are now available.' 
                  : 'Connection failed. Please check your API key and try again.'
                }
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <h4 className="font-medium text-gray-900">AI Features</h4>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">Content Generation</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Smart caption generation</li>
                <li>• Hashtag suggestions</li>
                <li>• Content optimization</li>
                <li>• Multi-platform adaptation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">AI Assistant</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Intelligent chat responses</li>
                <li>• Strategy recommendations</li>
                <li>• Performance insights</li>
                <li>• Trend analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Security Notice</p>
            <p className="text-blue-700 mt-1">
              Your API key is stored locally in your browser and is never sent to our servers. 
              For production use, consider implementing a secure backend proxy for API calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};