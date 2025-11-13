import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Call, CallType } from '@/types/call';

interface CallHistoryProps {
  calls: Call[];
  onStartCall: (eventId: string, type: CallType) => void;
  formatCallTime: (timestamp: string) => string;
  formatCallDuration: (seconds: number) => string;
}

export function CallHistory({ calls, onStartCall, formatCallTime, formatCallDuration }: CallHistoryProps) {
  const getCallIcon = (call: Call) => {
    const iconSize = 16;
    
    if (call.status === 'missed') {
      return <PhoneMissed size={iconSize} className="text-red-500" />;
    }
    
    if (call.isOutgoing) {
      return <PhoneOutgoing size={iconSize} className="text-blue-500" />;
    }
    
    return <PhoneIncoming size={iconSize} className="text-green-500" />;
  };

  const getCallStatusText = (call: Call) => {
    if (call.status === 'ended' && call.duration) {
      return formatCallDuration(call.duration);
    }
    
    switch (call.status) {
      case 'missed': return 'Missed';
      case 'rejected': return 'Rejected';
      case 'failed': return 'Failed';
      case 'ended': return 'Ended';
      default: return call.status;
    }
  };

  const getCallStatusColor = (call: Call) => {
    switch (call.status) {
      case 'missed':
      case 'failed':
      case 'rejected':
        return 'text-red-500';
      case 'ended':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="text-blue-600" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No call history</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your call history will appear here once you make or receive calls
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {calls.map((call) => (
        <div
          key={call.id}
          className="glass-card p-4 rounded-2xl hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Call Type Icon */}
              <div className="flex-shrink-0">
                {getCallIcon(call)}
              </div>
              
              {/* Call Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {call.type === 'video' ? 'Video Call' : 'Audio Call'}
                  </h4>
                  {call.participants.length > 1 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {call.participants.length} participants
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {formatCallTime(call.startTime)}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className={getCallStatusColor(call)}>
                    {getCallStatusText(call)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              {/* Audio Call Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartCall(call.eventId, 'audio')}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Audio call"
              >
                <Phone size={16} />
              </Button>
              
              {/* Video Call Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartCall(call.eventId, 'video')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Video call"
              >
                <Video size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}