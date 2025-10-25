import { MapPin, Clock, Repeat, Info, Target, Award, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface SearchActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    activity_id: string;
    title: string;
    sport_type: string;
    description: string;
    scheduled_datetime: string;
    recurrence_pattern?: string;
    capacity?: number;
    is_group_activity: boolean;
    difficulty_level?: string;
    host: {
      name: string;
      avatar_url?: string;
      location?: string;
    };
  } | null;
}

const formatDateTime = (datetime: string, recurrence?: string) => {
  const date = new Date(datetime);
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  if (recurrence) {
    return `${timeStr} • ${recurrence}`;
  }
  return `${dateStr} at ${timeStr}`;
};

export function SearchActivityModal({ isOpen, onClose, activity }: SearchActivityModalProps) {
  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-lg max-h-[95vh] p-0">
        <div className="glass-card flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-section-header font-semibold">{activity.title}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">View activity details</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Host Section with Profile Picture */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 shadow-lg">
                <AvatarImage src={activity.host.avatar_url} alt={activity.host.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-lg font-semibold">
                  {activity.host.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Hosted by</div>
                <h2 className="text-lg font-semibold text-foreground">{activity.host.name}</h2>
                {activity.host.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{activity.host.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="activity" className="text-sm px-4 py-2">
                  {activity.sport_type}
                </Badge>
                {activity.is_group_activity && (
                  <Badge variant="activity" className="text-sm px-4 py-2">
                    Group Activity
                  </Badge>
                )}
                {activity.recurrence_pattern && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Repeat className="h-4 w-4 mr-1" />
                    <span>Recurring</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDateTime(activity.scheduled_datetime, activity.recurrence_pattern)}</span>
              </div>
            </div>

            {/* Activity Description */}
            {activity.description && (
              <div className="glass-card p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  About this Activity
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
              </div>
            )}

            {/* Activity Details */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Activity Details
              </h4>
              <div className="space-y-2">
                {activity.difficulty_level && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-muted-foreground">Level: {activity.difficulty_level}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-muted-foreground">
                    {activity.is_group_activity ? 'Group activity' : 'One-on-one session'}
                  </span>
                </div>
                {activity.capacity && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-muted-foreground">Capacity: {activity.capacity} participants</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Stats */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Quick Info
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {activity.capacity || (activity.is_group_activity ? '5-10' : '1:1')}
                  </div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {activity.difficulty_level || 'All'}
                  </div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {activity.recurrence_pattern || 'One-time'}
                  </div>
                  <div className="text-xs text-muted-foreground">Frequency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
