import { useState } from 'react';
import { UserPlus, Copy, Share, X, QrCode, MessageCircle, Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TopNavigationProps {
  onNavigate?: (tab: string) => void;
}

export function TopNavigation({ onNavigate }: TopNavigationProps) {
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'link' | 'qr' | 'message'>('link');

  const copyInviteLink = async () => {
    const inviteLink = 'https://connectsphere.app/invite/alex123';
    await navigator.clipboard.writeText(inviteLink);
    setShowInviteOptions(false);
  };

  const copyInviteMessage = async () => {
    const message = "🎯 Join me on ConnectSphere! Let's connect through activities we both love. Use my invite link: https://connectsphere.app/invite/alex123";
    await navigator.clipboard.writeText(message);
    setShowInviteOptions(false);
  };

  const shareNatively = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join ConnectSphere',
        text: "🎯 Join me on ConnectSphere! Let's connect through activities we both love.",
        url: 'https://connectsphere.app/invite/alex123'
      });
    }
    setShowInviteOptions(false);
  };

  const quickActions = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      action: () => {
        onNavigate?.('notifications');
        setShowInviteOptions(false);
      },
      color: 'from-orange-500 to-amber-400'
    },
    {
      id: 'invite',
      icon: Share,
      label: 'Invite Friends',
      action: () => setShowInviteDialog(true),
      color: 'from-blue-500 to-cyan-400'
    }
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20 mx-4 mt-4 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center py-3 px-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-slate-700">ConnectSphere</span>
          </div>

          {/* Floating Action Menu */}
          <div className="relative z-50">
            {/* Quick Action Bubbles */}
            {showInviteOptions && (
              <div className="absolute top-14 right-0 space-y-2 z-[60] animate-in fade-in-0 slide-in-from-top-2 duration-200">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-right-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="bg-white backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-200">
                        <span className="text-gray-700 text-xs font-medium whitespace-nowrap">{action.label}</span>
                      </div>
                      <Button
                        onClick={action.action}
                        className={`h-11 w-11 rounded-full bg-gradient-to-r ${action.color} text-white border-0 hover:shadow-xl transform hover:scale-110 transition-all duration-200 shadow-lg`}
                      >
                        <Icon size={18} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Main FAB */}
            <Button
              onClick={() => setShowInviteOptions(!showInviteOptions)}
              className={`h-12 w-12 rounded-full text-white border-0 hover:shadow-xl transform hover:scale-110 transition-all duration-300 shadow-xl z-50 ${
                showInviteOptions 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 rotate-45' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
            >
              {showInviteOptions ? <X size={20} /> : <UserPlus size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md bg-white border-0 z-[70]">
          <DialogHeader>
            <DialogTitle className="gradient-text text-center text-xl">
              Invite Friends to ConnectSphere
            </DialogTitle>
            <DialogDescription className="sr-only">
              Invite friends to join ConnectSphere and discover activities together.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Social Proof */}
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                ))}
              </div>
              <p className="text-subtext text-sm">
                Join 10,000+ people connecting through shared activities
              </p>
            </div>

            {/* Invite Methods */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={inviteMethod === 'link' ? 'default' : 'outline'}
                onClick={() => setInviteMethod('link')}
                className="flex flex-col h-20 rounded-xl"
              >
                <Copy size={20} />
                <span className="text-xs mt-1">Link</span>
              </Button>
              <Button
                variant={inviteMethod === 'message' ? 'default' : 'outline'}
                onClick={() => setInviteMethod('message')}
                className="flex flex-col h-20 rounded-xl"
              >
                <MessageCircle size={20} />
                <span className="text-xs mt-1">Message</span>
              </Button>
              <Button
                variant={inviteMethod === 'qr' ? 'default' : 'outline'}
                onClick={() => setInviteMethod('qr')}
                className="flex flex-col h-20 rounded-xl"
              >
                <QrCode size={20} />
                <span className="text-xs mt-1">QR Code</span>
              </Button>
            </div>

            {/* Invite Content */}
            <div className="glass-card p-4 rounded-xl">
              {inviteMethod === 'link' && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Share your invite link:</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/70 p-3 rounded-lg text-sm text-slate-700 border">
                      https://connectsphere.app/invite/alex123
                    </div>
                    <Button onClick={copyInviteLink} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                      <Copy size={18} />
                    </Button>
                  </div>
                </div>
              )}
              
              {inviteMethod === 'message' && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Invite message:</p>
                  <div className="bg-white/70 p-3 rounded-lg text-sm text-slate-700 border">
                    🎯 Join me on ConnectSphere! Let's connect through activities we both love. Use my invite link: https://connectsphere.app/invite/alex123
                  </div>
                  <Button onClick={copyInviteMessage} className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                    Copy Message
                  </Button>
                </div>
              )}
              
              {inviteMethod === 'qr' && (
                <div className="space-y-3 text-center">
                  <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode size={80} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-600">Scan to join ConnectSphere</p>
                </div>
              )}
            </div>

            {/* Gamification */}
            <div className="glass-card p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">+5</span>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Earn 5 XP per friend</p>
                  <p className="text-xs text-slate-600">Level up faster with referrals!</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}