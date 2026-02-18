import { Plus, Calendar, MapPin, Users, Loader2, LogIn } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/context/AuthContext';
import { useActivityParticipants } from '@/hooks/useActivityParticipants';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function BrowseActivitiesPage() {
  const { activities, loading } = useActivities();
  const { user } = useAuth();
  const { joinActivity, isJoining } = useActivityParticipants();
  const navigate = useNavigate();

  const handleJoinOrSignup = (activityId: string) => {
    if (!user) {
      navigate('/auth?redirect=/browse');
    } else {
      joinActivity(activityId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Activities</h1>
          <p className="text-muted-foreground text-sm">{activities.length} public activities near you</p>
        </div>
        {!user && (
          <Button onClick={() => navigate('/auth')} variant="outline" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        {/* CTA Banner for guests */}
        {!user && (
          <div className="glass-card p-5 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <p className="font-semibold text-foreground mb-1">Join the community</p>
            <p className="text-sm text-muted-foreground mb-3">Create a free account to join activities and connect with people</p>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
              Create free account
            </Button>
          </div>
        )}

        {activities.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to create an activity!</p>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Get started
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
                  <div className="mb-3">
                    <h3 className="text-section-header gradient-text mb-1">{activity.title}</h3>
                    <p className="text-subtext text-sm line-clamp-2">{activity.description || 'Join this activity!'}</p>
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
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                      onClick={() => handleJoinOrSignup(activity.id)}
                      disabled={isJoining}
                    >
                      {!user ? (
                        <>
                          <LogIn className="h-3 w-3 mr-1" />
                          Join
                        </>
                      ) : (
                        isJoining ? 'Joining...' : 'Join Activity'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
