import { useState } from 'react';
import { Sparkles, Copy, Share, QrCode, Mail, Calendar, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface InviteFloatingActionProps {
  onNavigate?: (tab: string) => void;
  onCreateEvent?: () => void;
}

export function InviteFloatingAction({ onCreateEvent }: InviteFloatingActionProps) {
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showShareProfile, setShowShareProfile] = useState(false);

  const inviteLink = "https://connectsphere.app/invite/alex-morgan-xyz123";
  const inviteMessage = "Hey! I'm using ConnectSphere to discover amazing activities and connect with like-minded people. Join me and let's explore together! 🌟";

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const copyInviteMessage = () => {
    navigator.clipboard.writeText(`${inviteMessage}\n\n${inviteLink}`);
    toast.success('Invite message copied to clipboard!');
  };

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on ConnectSphere!',
          text: inviteMessage,
          url: inviteLink,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      copyInviteMessage();
    }
  };

  const quickActions = [
    {
      id: 'create-event',
      icon: Calendar,
      label: 'Create Event',
      action: () => {
        onCreateEvent?.();
        setShowInviteOptions(false);
      },
      color: 'from-green-500 to-emerald-400'
    },
    {
      id: 'share-profile',
      icon: QrCode,
      label: 'Share Profile',
      action: () => {
        setShowShareProfile(true);
        setShowInviteOptions(false);
      },
      color: 'from-purple-500 to-pink-400'
    },
    {
      id: 'invite-others',
      icon: Share,
      label: 'Invite Others',
      action: () => setShowInviteDialog(true),
      color: 'from-blue-500 to-cyan-400'
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
                
                // Define positions closer to FAB with larger gaps between options
                const positions = [
                  { x: -60, y: -35 },   // Invite Others: closer to FAB, bottom-left
                  { x: -100, y: -85 },  // Share Profile: 40px horizontal, 50px vertical gap
                  { x: -140, y: -140 }  // Create Event: 40px horizontal, 55px vertical gap
                ];
                
                const position = positions[index] || { x: -90, y: -60 };
                
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
            {showInviteOptions ? <Minus size={24} /> : <Sparkles size={24} />}
          </Button>
        </div>
      </div>

      {/* Detailed Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Others to ConnectSphere</DialogTitle>
            <DialogDescription>
              Share ConnectSphere with friends and explore activities together!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-xl gradient-text font-semibold">5+</div>
                <div className="text-subtext text-xs">Friends Joined</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-xl text-green-600 font-semibold">2x</div>
                <div className="text-subtext text-xs">More Fun Together</div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <div>
                <label className="text-subtext text-xs">Invite Link</label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={inviteLink} 
                    readOnly 
                    className="bg-white/50 text-xs"
                  />
                  <Button onClick={copyInviteLink} variant="outline" size="sm" className="choice-chip">
                    <Copy size={14} />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-subtext text-xs">Invite Message</label>
                <div className="bg-white/50 p-3 rounded-lg text-xs text-gray-600 mt-1">
                  {inviteMessage}
                </div>
                <Button onClick={copyInviteMessage} variant="outline" size="sm" className="choice-chip mt-2 w-full">
                  <Copy size={14} className="mr-2" />
                  Copy Message + Link
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={shareNatively}
                className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0"
              >
                <Share size={16} className="mr-2" />
                Share
              </Button>
              <Button 
                onClick={() => {
                  const subject = "Join me on ConnectSphere!";
                  const body = `${inviteMessage}\n\n${inviteLink}`;
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
                variant="outline" 
                className="choice-chip"
              >
                <Mail size={16} className="mr-2" />
                Email
              </Button>
            </div>

            <div className="text-center">
              <p className="text-subtext text-xs">
                🎉 Invite friends to unlock group activities and earn bonus XP together!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Profile Dialog */}
      <Dialog open={showShareProfile} onOpenChange={setShowShareProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile QR Code</DialogTitle>
            <DialogDescription>
              Share this QR code with others to let them easily connect with your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* QR Code Section */}
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                {/* QR Code representation with blue squares */}
                <div className="grid grid-cols-4 gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                </div>
              </div>
              <p className="text-subtext text-sm mb-1">@alexmorgan</p>
            </div>

            {/* Share your profile section */}
            <div className="text-center">
              <h4 className="text-body mb-2">Share your profile with others</h4>
              <p className="text-subtext text-sm mb-4">connectsphere.app/user/alexmorgan</p>
              
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('https://connectsphere.app/user/alexmorgan');
                  toast.success('QR link copied to clipboard!');
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 rounded-lg px-6 py-3 mb-6"
              >
                <Copy size={16} className="mr-2" />
                Copy QR Link
              </Button>
            </div>

            {/* Profile Link and Share Options */}
            <div className="space-y-4">
              <div>
                <label className="text-subtext text-sm block mb-2">Profile Link</label>
                <div className="flex gap-2">
                  <Input 
                    value="https://connectsphere.app/profile/alex-morgan" 
                    readOnly 
                    className="bg-blue-50 text-blue-600 border-blue-200 text-sm"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText('https://connectsphere.app/profile/alex-morgan');
                      toast.success('Profile link copied to clipboard!');
                    }} 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 p-3"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              {/* Share and Email buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => {
                    const text = "Check out my ConnectSphere profile! Let's connect and explore activities together 🌟";
                    const url = "https://connectsphere.app/profile/alex-morgan";
                    if (navigator.share) {
                      navigator.share({ title: "My ConnectSphere Profile", text, url });
                    } else {
                      navigator.clipboard.writeText(`${text}\n\n${url}`);
                      toast.success('Profile info copied to clipboard!');
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-400 text-white border-0 rounded-lg"
                >
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
                <Button 
                  onClick={() => {
                    const subject = "Connect with me on ConnectSphere!";
                    const body = "Hey! Check out my ConnectSphere profile and let's explore activities together 🌟\n\nhttps://connectsphere.app/profile/alex-morgan";
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}
                  variant="outline" 
                  className="border-gray-300 rounded-lg"
                >
                  <Mail size={16} className="mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}