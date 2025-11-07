import { useState } from 'react';
import { Plus, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { ConnectModal } from './ConnectModal';

interface InviteFloatingActionProps {
  onNavigate?: (tab: string) => void;
  onCreateEvent?: () => void;
}

export function InviteFloatingAction({ onCreateEvent }: InviteFloatingActionProps) {
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const quickActions = [
    {
      id: 'connect',
      icon: Users,
      label: 'Connect',
      action: () => {
        setShowConnectModal(true);
        setShowInviteOptions(false);
      },
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'create-event',
      icon: Calendar,
      label: 'Create Event',
      action: () => {
        onCreateEvent?.();
        setShowInviteOptions(false);
      },
      color: 'from-green-500 to-emerald-400'
    }
  ];

  return (
    <>
      {/* Floating Action Button - Above Profile Icon */}
      <div className="fixed bottom-20 right-8 z-40">
        <div className="relative">
          {/* Quick Action Bubbles - Curved Arrow Trajectory */}
          {showInviteOptions && (
            <div className="absolute bottom-0 right-0">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                
                // Define positions for 2 actions
                const positions = [
                  { x: -60, y: -35 },   // Connect: closer to FAB
                  { x: -100, y: -85 }   // Create Event: further up
                ];
                
                const position = positions[index] || { x: -80, y: -60 };
                
                return (
                  <div
                    key={action.id}
                    className="absolute"
                    style={{
                      right: '0px',
                      bottom: '0px',
                    }}
                  >
                    <div
                      className={showInviteOptions ? `fab-curved-arrow-${index + 1}` : ''}
                      style={{
                        transform: showInviteOptions 
                          ? `translate(${position.x}px, ${position.y}px) scale(1)` 
                          : 'translate(-15px, 5px) scale(0)',
                        animationDelay: `${index * 50}ms`,
                        transition: showInviteOptions 
                          ? 'none' 
                          : `all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) ${(quickActions.length - index - 1) * 60}ms`,
                        opacity: showInviteOptions ? 1 : 0
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-white/30">
                          <span className="text-subtext text-xs whitespace-nowrap">{action.label}</span>
                        </div>
                        <Button
                          onClick={action.action}
                          className={`h-12 w-12 rounded-full bg-gradient-to-r ${action.color} text-white border-0 hover:shadow-xl transform hover:scale-110 transition-all duration-200 shadow-lg`}
                        >
                          <Icon size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Main FAB */}
          <Button
            onClick={() => setShowInviteOptions(!showInviteOptions)}
            className={`h-14 w-14 rounded-full text-white border-0 hover:shadow-xl transform hover:scale-110 transition-all duration-300 shadow-xl relative z-10 ${
              showInviteOptions 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
          >
            {showInviteOptions ? <Plus className="rotate-45" size={24} /> : <Plus size={24} />}
          </Button>
        </div>
      </div>

      {/* Connect Modal */}
      <ConnectModal 
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </>
  );
}