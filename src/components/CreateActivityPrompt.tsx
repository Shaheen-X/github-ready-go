import React from 'react';
import { Button } from './ui/button';
import { Plus, Sparkles, Users, MapPin } from 'lucide-react';

interface CreateActivityPromptProps {
  onClick: () => void;
}

const CreateActivityPrompt: React.FC<CreateActivityPromptProps> = ({ onClick }) => {
  return (
    <div className="glass-card p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full -translate-y-6 translate-x-6"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full translate-y-4 -translate-x-4"></div>
      
      <div className="text-center space-y-4 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Plus className="h-8 w-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-section-header gradient-text mb-2">Ready to Create Something Amazing?</h3>
          <p className="text-subtext">Start a new activity and connect with like-minded people in your area.</p>
        </div>
        
        {/* Activity type suggestions */}
        <div className="flex flex-wrap justify-center gap-2 py-2">
          <div className="flex items-center space-x-1 bg-white/60 rounded-full px-3 py-1">
            <Users className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-gray-600">Group Activities</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/60 rounded-full px-3 py-1">
            <MapPin className="h-3 w-3 text-green-500" />
            <span className="text-xs text-gray-600">Local Events</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/60 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3 text-purple-500" />
            <span className="text-xs text-gray-600">Special Meetups</span>
          </div>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full px-8 py-3 text-button shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          onClick={onClick}
        >
          <Plus className="mr-2 w-5 h-5" />
          Create Activity
        </Button>
      </div>
    </div>
  );
};

export default CreateActivityPrompt;