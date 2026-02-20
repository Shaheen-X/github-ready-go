import { Plus, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useActivities } from '@/hooks/useActivities';
import { useActivityParticipants } from '@/hooks/useActivityParticipants';
import { useCalendarEventsDB } from '@/hooks/useCalendarEventsDB';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { CreateActivityModal } from './CreateActivityModal';
import type { NewEventInput } from '@/types/calendar';

export function Activities() {
  const { activities, loading, refreshActivities } = useActivities();
  const { joinActivity, leaveActivity, isJoining, isLeaving, checkParticipation } = useActivityParticipants();
  const { createEvent } = useCalendarEventsDB();
  const [participationStatus, setParticipationStatus] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check participation status for all activities
  useEffect(() => {
    const checkAllParticipation = async () => {
      const status: Record<string, boolean> = {};
      for (const activity of activities) {
        status[activity.id] = await checkParticipation(activity.id);
      }
      setParticipationStatus(status);
    };
    
    if (activities.length > 0) {
      checkAllParticipation();
    }
  }, [activities]);

  const handleJoinActivity = (activityId: string) => {
    joinActivity(activityId);
    setParticipationStatus(prev => ({ ...prev, [activityId]: true }));
  };

  const handleLeaveActivity = (activityId: string) => {
    leaveActivity(activityId);
    setParticipationStatus(prev => ({ ...prev, [activityId]: false }));
  };

  const handleCreateActivity = (activityData: any) => {
    const date = new Date(`${activityData.date}T${activityData.time}`);
    const eventInput: NewEventInput = {
      title: activityData.eventName,
      type: 'group',
      date,
      time: activityData.time,
      location: activityData.location || '',
      description: activityData.description || '',
      attendees: [],
      maxParticipants: activityData.maxParticipants ? parseInt(activityData.maxParticipants) : 0,
      tags: activityData.activity ? [activityData.activity] : [],
      image: activityData.selectedImage,
    };
    createEvent(eventInput);
    // Refresh after a short delay to let the DB settle
    setTimeout(() => refreshActivities(), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card border-b border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Activities</h1>
            <p className="text-subtext text-sm">{activities.length} public activities</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to create an activity!</p>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="glass-card overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={activity.image || `https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop`}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
                    {activity.activity || activity.type}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-section-header gradient-text mb-1">{activity.title}</h3>
                      <p className="text-subtext text-sm line-clamp-2">{activity.description || 'Join this activity!'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(activity.date, 'EEE, MMM d')} at {activity.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{activity.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{activity.attendees.length}/{activity.maxParticipants || '∞'} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {activity.hostName?.charAt(0) || 'H'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hosted by</p>
                        <p className="text-sm font-medium">{activity.hostName || 'Host'}</p>
                      </div>
                    </div>
                    {participationStatus[activity.id] ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleLeaveActivity(activity.id)}
                        disabled={isLeaving}
                      >
                        {isLeaving ? 'Leaving...' : 'Leave'}
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                        onClick={() => handleJoinActivity(activity.id)}
                        disabled={isJoining}
                      >
                        {isJoining ? 'Joining...' : 'Join Activity'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateActivity={handleCreateActivity}
      />
    </div>
  );
}
