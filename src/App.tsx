import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { Navigation } from './components/layout/Navigation';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { PostCreator } from './components/post-creator/PostCreator';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AIChatBox } from './components/ai-chat/AIChatBox';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
            <img 
              src="/Visora 1.png" 
              alt="Vizora" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Vizora...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  const handleCreatePost = () => {
    setShowPostCreator(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onCreatePost={handleCreatePost} />;
      case 'create':
        return <Dashboard onCreatePost={handleCreatePost} />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard onCreatePost={handleCreatePost} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          onLogout={logout} 
          onOpenChat={() => setShowAIChat(true)}
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {showPostCreator && (
        <PostCreator onClose={() => setShowPostCreator(false)} />
      )}

      <AIChatBox 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
      />
    </div>
  );
}

export default App;