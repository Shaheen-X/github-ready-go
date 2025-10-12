import { useState } from 'react';
import { Home, Search, MessageCircle, Calendar, User } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to ConnectSphere
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your social activity platform is being set up. Currently showing: {activeTab}
          </p>
          
          <div className="grid gap-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <div key={tab.id} className="p-6 bg-card rounded-lg shadow-sm border border-border">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-card-foreground">{tab.label}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50 mx-4 mb-4 rounded-2xl shadow-2xl">
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground transform scale-110 shadow-lg' 
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
