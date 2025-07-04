import React from 'react';
import { TrendingUp, Users, Heart, Eye, Share2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../common/Card';

export const AnalyticsView: React.FC = () => {
  const metrics = [
    { label: 'Total Reach', value: '45.2K', change: '+12.5%', icon: Eye, color: 'blue' },
    { label: 'Engagement Rate', value: '8.4%', change: '+2.1%', icon: Heart, color: 'red' },
    { label: 'New Followers', value: '1,234', change: '+18.3%', icon: Users, color: 'green' },
    { label: 'Total Shares', value: '892', change: '+5.7%', icon: Share2, color: 'purple' }
  ];

  const topPosts = [
    {
      id: '1',
      content: 'Behind the scenes of our creative process...',
      platform: 'Instagram',
      engagement: 1250,
      reach: 8900,
      date: '2024-12-10'
    },
    {
      id: '2',
      content: 'Tips for better productivity in 2024',
      platform: 'LinkedIn',
      engagement: 890,
      reach: 5600,
      date: '2024-12-08'
    },
    {
      id: '3',
      content: 'Quick design tutorial thread',
      platform: 'Twitter',
      engagement: 567,
      reach: 3400,
      date: '2024-12-06'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{metric.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Engagement Over Time</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <p className="text-gray-600">Interactive chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Instagram</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Twitter</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">68%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Facebook</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">61%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{post.content}</p>
                    <p className="text-sm text-gray-500">{post.platform} • {post.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.engagement}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.reach}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};