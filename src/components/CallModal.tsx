import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Speaker, Volume2, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ActiveCall } from '@/types/call';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CallModalProps {
  activeCall: ActiveCall;
  isOpen: boolean;
  onClose: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  formatCallDuration: (seconds: number) => string;
  getCallStatusText: (status: any) => string;
}

export function CallModal({
  activeCall,
  isOpen,
  onClose,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  localVideoRef,
  remoteVideoRef,
  formatCallDuration,
  getCallStatusText,
}: CallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Update call duration every second when call is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeCall.call.status === 'active') {
      interval = setInterval(() => {
        const startTime = new Date(activeCall.call.startTime);
        const now = new Date();
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setCallDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall.call.status, activeCall.call.startTime]);

  const handleEndCall = () => {
    onEndCall();
    onClose();
  };

  const isVideoCall = activeCall.call.type === 'video';
  const otherParticipants = activeCall.participants.filter(p => p.id !== 'current-user');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0 overflow-hidden">
        <div className={`h-full flex flex-col ${isVideoCall ? 'bg-black' : 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'}`}>
          
          {/* Video Layout */}
          {isVideoCall && (
            <div className="flex-1 relative">
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted={false}
              />
              
              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                {!activeCall.isLocalVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="text-white" size={24} />
                  </div>
                )}
              </div>

              {/* Call Status Overlay */}
              <div className="absolute top-4 left-4 right-40 bg-black/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {otherParticipants.slice(0, 3).map((participant) => (
                      <div key={participant.id} className="relative">
                        <ImageWithFallback
                          src={participant.avatar || ''}
                          alt={participant.name}
                          className="w-8 h-8 rounded-full border-2 border-white/50"
                        />
                        {!participant.isConnected && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    ))}
                    {otherParticipants.length > 3 && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white/50 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          +{otherParticipants.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {otherParticipants.length > 1 ? 'Group Video Call' : otherParticipants[0]?.name || 'Video Call'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {activeCall.call.status === 'active' 
                        ? formatCallDuration(callDuration)
                        : getCallStatusText(activeCall.call.status)
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio Call Layout */}
          {!isVideoCall && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              {/* Participants */}
              <div className="mb-8">
                <div className="flex justify-center -space-x-4 mb-4">
                  {otherParticipants.slice(0, 3).map((participant) => (
                    <div key={participant.id} className="relative">
                      <div className="w-20 h-20 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center">
                        {participant.avatar ? (
                          <ImageWithFallback
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-medium text-white">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {!participant.isConnected && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                        </div>
                      )}
                      {participant.isMuted && (
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <MicOff size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {otherParticipants.length > 3 && (
                    <div className="w-20 h-20 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        +{otherParticipants.length - 3}
                      </span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {otherParticipants.length > 1 ? 'Group Audio Call' : otherParticipants[0]?.name || 'Audio Call'}
                </h3>
                <p className="text-white/70">
                  {activeCall.call.status === 'active' 
                    ? formatCallDuration(callDuration)
                    : getCallStatusText(activeCall.call.status)
                  }
                </p>
              </div>
            </div>
          )}

          {/* Call Controls */}
          <div className="bg-black/80 backdrop-blur-sm p-6">
            <div className="flex items-center justify-center gap-4">
              
              {/* Mute Button */}
              <Button
                onClick={onToggleMute}
                size="lg"
                className={`w-14 h-14 rounded-full ${
                  activeCall.isLocalMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                {activeCall.isLocalMuted ? (
                  <MicOff size={24} className="text-white" />
                ) : (
                  <Mic size={24} className="text-white" />
                )}
              </Button>

              {/* Video Toggle (only for video calls) */}
              {isVideoCall && (
                <Button
                  onClick={onToggleVideo}
                  size="lg"
                  className={`w-14 h-14 rounded-full ${
                    !activeCall.isLocalVideoEnabled
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {activeCall.isLocalVideoEnabled ? (
                    <Video size={24} className="text-white" />
                  ) : (
                    <VideoOff size={24} className="text-white" />
                  )}
                </Button>
              )}

              {/* Speaker Button (audio calls only) */}
              {!isVideoCall && (
                <Button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  size="lg"
                  className={`w-14 h-14 rounded-full ${
                    isSpeakerOn
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {isSpeakerOn ? (
                    <Volume2 size={24} className="text-white" />
                  ) : (
                    <Speaker size={24} className="text-white" />
                  )}
                </Button>
              )}

              {/* End Call Button */}
              <Button
                onClick={handleEndCall}
                size="lg"
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff size={24} className="text-white" />
              </Button>

              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                    <MoreVertical size={24} className="text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/20">
                  <DropdownMenuItem>
                    <Users size={14} className="mr-2" />
                    Add participants
                  </DropdownMenuItem>
                  {isVideoCall && (
                    <DropdownMenuItem>
                      <Phone size={14} className="mr-2" />
                      Switch to audio
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Participants Status (bottom bar) */}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/70">
              {activeCall.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-1">
                  <span>{participant.id === 'current-user' ? 'You' : participant.name}</span>
                  {participant.isMuted && <MicOff size={12} />}
                  {isVideoCall && !participant.isVideoEnabled && <VideoOff size={12} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}