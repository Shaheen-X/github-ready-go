import { ArrowLeft, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalls } from '@/hooks/useCalls';
import { CallHistory } from '@/components/CallHistory';
import { CallModal } from '@/components/CallModal';
import { useNavigate } from 'react-router-dom';

export function CallsPage() {
  const navigate = useNavigate();
  const {
    activeCall,
    callHistory,
    isCallModalOpen,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    setIsCallModalOpen,
    localVideoRef,
    remoteVideoRef,
    formatCallDuration,
    getCallStatusText,
    formatCallTime,
  } = useCalls();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Header */}
      <div className="glass-card border-b border-white/20 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Calls</h1>
              <p className="text-sm text-muted-foreground">
                {callHistory.length} {callHistory.length === 1 ? 'call' : 'calls'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
              title="New audio call"
            >
              <Phone size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
              title="New video call"
            >
              <Video size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Call History */}
      <div className="flex-1 overflow-y-auto p-4">
        <CallHistory
          calls={callHistory}
          onStartCall={startCall}
          formatCallTime={formatCallTime}
          formatCallDuration={formatCallDuration}
        />
      </div>

      {/* Call Modal */}
      {activeCall && (
        <CallModal
          activeCall={activeCall}
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          formatCallDuration={formatCallDuration}
          getCallStatusText={getCallStatusText}
        />
      )}
    </div>
  );
}