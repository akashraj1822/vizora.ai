import React from 'react';
import { Bell, Search, MessageSquare, LogOut } from 'lucide-react';
import { User } from '../../types';
import { Button } from '../common/Button';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenChat }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, analytics, or settings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* AI Chat Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={MessageSquare}
            onClick={onOpenChat}
            className="relative"
          >
            AI Assistant
          </Button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Profile Photo Only */}
          <div className="flex items-center space-x-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
            />
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={onLogout}
              className="text-gray-400 hover:text-red-600"
            />
          </div>
        </div>
      </div>
    </header>
  );
};