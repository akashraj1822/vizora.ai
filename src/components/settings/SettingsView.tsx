import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Smartphone, Camera, Mail, Phone, MapPin, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ConnectPlatforms } from '../auth/ConnectPlatforms';
import { APISettings } from './APISettings';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';

export const SettingsView: React.FC = () => {
  const { user, connectPlatform } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'platforms', label: 'Social Platforms', icon: Smartphone },
    { id: 'api', label: 'AI & API Settings', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'general', label: 'General', icon: Globe }
  ];

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Joined December 2023</span>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.connectedPlatforms.filter(p => p.isConnected).length}
                  </div>
                  <div className="text-sm text-gray-600">Connected Platforms</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.connectedPlatforms.reduce((sum, p) => sum + (p.followers || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Followers</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-teal-600">24</div>
                  <div className="text-sm text-gray-600">Posts This Month</div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        );

      case 'platforms':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connected Social Media Platforms</h3>
              <p className="text-gray-600 mb-6">
                Connect your social media accounts to start posting and managing your content across multiple platforms.
              </p>
            </div>
            <ConnectPlatforms
              platforms={user.connectedPlatforms}
              onConnect={connectPlatform}
            />
          </div>
        );

      case 'api':
        return <APISettings />;

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Post Reminders</p>
                    <p className="text-sm text-gray-500">Get notified before your scheduled posts go live</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Performance Updates</p>
                    <p className="text-sm text-gray-500">Weekly reports on your content performance</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">AI Suggestions</p>
                    <p className="text-sm text-gray-500">Get AI-powered content and timing suggestions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Platform Updates</p>
                    <p className="text-sm text-gray-500">News about connected social media platforms</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Privacy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Allow analytics tracking</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Share usage data for improvements</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Account Security</h4>
                  <div className="space-y-3">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Enable Two-Factor Authentication</Button>
                    <Button variant="outline">Download Account Data</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-purple-500 rounded-lg bg-white">
                      <div className="w-full h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Light (Current)</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-900">
                      <div className="w-full h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center text-white">Dark</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                      <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Accent Color</h4>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-purple-600"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-gray-200"></div>
                    <div className="w-8 h-8 bg-teal-600 rounded-full border-2 border-gray-200"></div>
                    <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-gray-200"></div>
                    <div className="w-8 h-8 bg-orange-600 rounded-full border-2 border-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                  <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>12-hour (AM/PM)</option>
                    <option>24-hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};