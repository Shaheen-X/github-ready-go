import React from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title = "Search", 
  showBack = false, 
  onBack 
}) => {
  return (
    <div className="glass-card border-b border-white/20 px-4 py-4 sticky top-0 z-10 mx-4 mt-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-app-title gradient-text">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <SearchIcon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;