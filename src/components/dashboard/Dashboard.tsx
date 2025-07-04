import React from 'react';
import { TrendingUp, Users, Heart, Calendar, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { StatsCard } from './StatsCard';
import { RecentPosts } from './RecentPosts';
import { ConnectPlatforms } from '../auth/ConnectPlatforms';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';

interface DashboardProps {
  onCreatePost: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreatePost }) => {
  const { user, connectPlatform } = useAuth();
  const { posts, isLoading } = usePosts();

  if (!user) return null;

  const connectedPlatforms = user.connectedPlatforms.filter(p => p.isConnected);
  const totalFollowers = connectedPlatforms.reduce((sum, platform) => sum + (platform.followers || 0), 0);
  const totalEngagement = posts.reduce((sum, post) => sum + (post.analytics?.engagement || 0), 0);
  const scheduledPosts = posts.filter(post => post.status === 'scheduled').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-purple-100 text-lg">
              Ready to create amazing content and grow your audience?
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            icon={PlusCircle}
            onClick={onCreatePost}
            className="bg-white text-purple-600 hover:bg-gray-50"
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Followers"
          value={totalFollowers.toLocaleString()}
          change={{ value: 12.5, isPositive: true }}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          change={{ value: 8.2, isPositive: true }}
          icon={Heart}
          color="blue"
        />
        <StatsCard
          title="Growth Rate"
          value="24.5%"
          change={{ value: 3.1, isPositive: true }}
          icon={TrendingUp}
          color="teal"
        />
        <StatsCard
          title="Scheduled Posts"
          value={scheduledPosts}
          icon={Calendar}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <RecentPosts posts={posts} />
        </div>

        {/* Quick Actions & Platform Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={PlusCircle}
                onClick={onCreatePost}
              >
                Create New Post
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Calendar}
              >
                View Calendar
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={TrendingUp}
              >
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Platform Connections */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Connected Platforms</h3>
              <p className="text-sm text-gray-600">
                {connectedPlatforms.length} of {user.connectedPlatforms.length} platforms connected
              </p>
            </CardHeader>
            <CardContent>
              <ConnectPlatforms
                platforms={user.connectedPlatforms}
                onConnect={connectPlatform}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};