import { Home, Search, MessageCircle, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', route: '/messages' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.route) {
      navigate(tab.route);
    } else {
      onTabChange(tab.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 z-50 mx-4 mb-4 rounded-2xl shadow-2xl">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white transform scale-110 shadow-lg shadow-blue-500/30' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'
              }`}
              style={{
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}