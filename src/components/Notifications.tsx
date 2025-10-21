import { useState } from 'react';
import { toast } from 'sonner';
import { useCalendarEvents } from '@/context/calendar-events-context';
import { EventCard } from './EventCard';
import { EventDetailsModal, type CalendarEventDetails } from './EventDetailsModal';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';
import { 
  Bell, 
  Check, 
  X, 
  Calendar, 
  Users,
  MessageCircle, 
  Trophy, 
  Clock, 
  UserPlus,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

interface Notification {
  id: string;
  type: 'activity' | 'message' | 'connection' | 'achievement' | 'reminder' | 'system' | 'event_invite';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  avatar?: string;
  metadata?: {
    activityId?: string;
    userId?: string;
    achievementId?: string;
    groupId?: string;
    count?: number;
    eventData?: CalendarEvent;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-invite-1',
    type: 'event_invite',
    title: 'Group Activity Invite: Morning Yoga Session',
    description: 'Sarah Johnson invited you to join a Morning Yoga session at Golden Gate Park on Oct 25 at 8:00 AM',
    timestamp: '5 minutes ago',
    isRead: false,
    isArchived: false,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop&crop=face',
    metadata: {
      eventData: {
        id: 'invite-event-1',
        title: 'Morning Yoga Session',
        type: 'group',
        activity: 'Yoga',
        date: new Date(2025, 9, 25, 8, 0),
        time: '8:00 AM',
        location: 'Golden Gate Park',
        description: 'Join us for a refreshing morning yoga session in the park!',
        attendees: [
          { id: 'att-1', name: 'Sarah Johnson', status: 'accepted' },
          { id: 'att-2', name: 'You', status: 'pending' }
        ],
        maxParticipants: 15,
        status: 'upcoming',
        tags: ['Yoga', 'Wellness', 'Morning'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        hostName: 'Sarah Johnson',
        hostId: 'user-sarah'
      }
    }
  },
  {
    id: 'notif-invite-2',
    type: 'event_invite',
    title: '1:1 Activity Invite: Coffee & Chat',
    description: 'Mike Chen invited you for a 1:1 coffee meetup at Blue Bottle Coffee on Oct 24 at 10:00 AM',
    timestamp: '30 minutes ago',
    isRead: false,
    isArchived: false,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    metadata: {
      eventData: {
        id: 'invite-event-2',
        title: 'Coffee & Chat',
        type: 'one-to-one',
        activity: 'Coffee',
        date: new Date(2025, 9, 24, 10, 0),
        time: '10:00 AM',
        location: 'Blue Bottle Coffee, Downtown',
        description: 'Let\'s catch up over coffee and discuss some ideas!',
        attendees: [
          { id: 'att-3', name: 'Mike Chen', status: 'accepted' },
          { id: 'att-4', name: 'You', status: 'pending' }
        ],
        maxParticipants: 2,
        status: 'upcoming',
        tags: ['Coffee', 'Networking'],
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
        hostName: 'Mike Chen',
        hostId: 'user-mike'
      }
    }
  },
  {
    id: 'notif-1',
    type: 'activity',
    title: 'New Activity Near You',
    description: 'Tennis Match starting in 2 hours at Central Courts',
    timestamp: '10 minutes ago',
    isRead: false,
    isArchived: false,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=100&h=100&fit=crop&crop=face',
    metadata: { activityId: 'activity-123', count: 8 }
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'Sarah Johnson',
    description: 'Thanks for organizing the hiking trip! When is the next one?',
    timestamp: '25 minutes ago',
    isRead: false,
    isArchived: false,
    priority: 'medium',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c9c5?w=100&h=100&fit=crop&crop=face',
    metadata: { userId: 'user-456' }
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement Unlocked! 🏆',
    description: 'You\'ve earned the "Social Butterfly" achievement for connecting with 100+ people',
    timestamp: '1 hour ago',
    isRead: false,
    isArchived: false,
    priority: 'high',
    metadata: { achievementId: 'social-butterfly' }
  },
  {
    id: 'notif-4',
    type: 'connection',
    title: 'New Connection Request',
    description: 'Mike Chen wants to connect with you. You have 3 mutual connections.',
    timestamp: '2 hours ago',
    isRead: true,
    isArchived: false,
    priority: 'medium',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    metadata: { userId: 'user-789', count: 3 }
  },
  {
    id: 'notif-5',
    type: 'reminder',
    title: 'Activity Reminder',
    description: 'Coffee & Networking starts in 30 minutes at Blue Bottle Coffee',
    timestamp: '3 hours ago',
    isRead: true,
    isArchived: false,
    priority: 'urgent',
    metadata: { activityId: 'activity-456' }
  },
  {
    id: 'notif-6',
    type: 'activity',
    title: 'Activity Update',
    description: 'Mountain Hiking Adventure has been rescheduled to tomorrow at 9 AM',
    timestamp: '5 hours ago',
    isRead: true,
    isArchived: false,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1507881832262-0ce9b99b3deb?w=100&h=100&fit=crop&crop=face',
    metadata: { activityId: 'activity-789' }
  },
  {
    id: 'notif-7',
    type: 'system',
    title: 'Weekly Activity Summary',
    description: 'You participated in 4 activities this week and earned 150 XP. Great work!',
    timestamp: '1 day ago',
    isRead: true,
    isArchived: false,
    priority: 'low',
    metadata: { count: 4 }
  },
  {
    id: 'notif-8',
    type: 'connection',
    title: 'Emma Wilson',
    description: 'Accepted your connection request',
    timestamp: '1 day ago',
    isRead: true,
    isArchived: false,
    priority: 'low',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    metadata: { userId: 'user-101' }
  },
  {
    id: 'notif-9',
    type: 'activity',
    title: 'Activity Cancelled',
    description: 'Rock Climbing Session has been cancelled due to weather conditions',
    timestamp: '2 days ago',
    isRead: true,
    isArchived: false,
    priority: 'medium',
    metadata: { activityId: 'activity-321' }
  },
  {
    id: 'notif-10',
    type: 'achievement',
    title: 'Level Up! 🎉',
    description: 'Congratulations! You\'ve reached Level 12. Keep exploring new activities!',
    timestamp: '3 days ago',
    isRead: true,
    isArchived: false,
    priority: 'high',
    metadata: { count: 12 }
  }
];

interface NotificationsProps {
  onNavigate?: (tab: string) => void;
}

export function Notifications({ onNavigate }: NotificationsProps = { onNavigate: () => {} }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetails | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const { addEvents, respondToInvitation } = useCalendarEvents();

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const iconClass = priority === 'urgent' ? 'text-red-500' : 
                     priority === 'high' ? 'text-blue-500' : 
                     priority === 'medium' ? 'text-green-500' : 'text-gray-500';
    
    switch (type) {
      case 'activity':
        return <Calendar size={20} className={iconClass} />;
      case 'message':
        return <MessageCircle size={20} className={iconClass} />;
      case 'connection':
        return <UserPlus size={20} className={iconClass} />;
      case 'achievement':
        return <Trophy size={20} className={iconClass} />;
      case 'reminder':
        return <Clock size={20} className={iconClass} />;
      case 'system':
        return <Info size={20} className={iconClass} />;
      case 'event_invite':
        return <Calendar size={20} className={iconClass} />;
      default:
        return <Bell size={20} className={iconClass} />;
    }
  };

  const getPriorityIndicator = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>;
      case 'high':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'medium':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-300 rounded-full"></div>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isArchived: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowClearDialog(false);
  };

  const handleAcceptInvite = (notification: Notification) => {
    if (notification.metadata?.eventData) {
      const event = notification.metadata.eventData;
      // Add event to calendar
      addEvents([event]);
      // Update RSVP status
      respondToInvitation(event.id, 'You', 'accepted');
      // Mark notification as read and archive
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true, isArchived: true } : n)
      );
      toast.success(`You've accepted the invite to ${event.title}!`, {
        description: 'Event has been added to your calendar'
      });
    }
  };

  const handleDeclineInvite = (notification: Notification) => {
    if (notification.metadata?.eventData) {
      const event = notification.metadata.eventData;
      // Update RSVP status to declined (don't add to calendar)
      respondToInvitation(event.id, 'You', 'declined');
      // Mark notification as read and archive
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true, isArchived: true } : n)
      );
      toast.info(`You've declined the invite to ${event.title}`);
    }
  };

  const handleEventCardClick = (notification: Notification) => {
    if (notification.metadata?.eventData) {
      const event = notification.metadata.eventData;
      const eventDetails: CalendarEventDetails = {
        ...event,
        date: format(event.date, 'MMM d, yyyy')
      };
      setSelectedEvent(eventDetails);
      setShowEventDetails(true);
    }
  };

  const handleAcceptFromModal = (eventId: string | number) => {
    const notification = notifications.find(n => n.metadata?.eventData?.id === eventId);
    if (notification) {
      handleAcceptInvite(notification);
      setShowEventDetails(false);
    }
  };

  const handleDeclineFromModal = (eventId: string | number) => {
    const notification = notifications.find(n => n.metadata?.eventData?.id === eventId);
    if (notification) {
      handleDeclineInvite(notification);
      setShowEventDetails(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (notification.isArchived) return false;
    
    if (activeTab === 'unread') {
      return !notification.isRead;
    }
    
    return true; // 'all' tab
  });

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => onNavigate?.('home')}
            >
              <ChevronRight size={16} className="rotate-180" />
            </Button>
            <h1 className="text-section-header">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="choice-chip">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={markAllAsRead}>
                  <CheckCircle2 size={16} className="mr-2" />
                  Mark All as Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowClearDialog(true)} className="text-red-600">
                  <Trash2 size={16} className="mr-2" />
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-full p-1 shadow-lg">
            <TabsTrigger 
              value="all" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'unread' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <Card className="glass-card p-8 text-center">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-body font-medium mb-2">No notifications here</h3>
                <p className="text-subtext">
                  {activeTab === 'unread' ? "You're all caught up!" : "Check back later for updates."}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id}>
                    {/* Event Invite Cards - use EventCard component */}
                    {notification.type === 'event_invite' && notification.metadata?.eventData ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check size={16} className="mr-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                <X size={16} className="mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <EventCard 
                          event={notification.metadata.eventData}
                          onClick={() => handleEventCardClick(notification)}
                        />
                      </div>
                    ) : (
                      /* Regular notification cards */
                      <Card
                        className={`glass-card transition-all duration-200 hover:shadow-md ${
                          !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                        }`}
                      >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0">
                          {notification.avatar ? (
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback>
                                {getNotificationIcon(notification.type, notification.priority)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-gray-200">
                              {getNotificationIcon(notification.type, notification.priority)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-body font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getPriorityIndicator(notification.priority)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical size={14} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.isRead && (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Check size={16} className="mr-2" />
                                      Mark as Read
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                    <X size={16} className="mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className={`text-subtext mb-2 leading-relaxed ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                            {notification.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-subtext">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{notification.timestamp}</span>
                              </div>
                              
                              {notification.metadata?.count && (
                                <div className="flex items-center gap-1">
                                  <Users size={12} />
                                  <span>{notification.metadata.count}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {notification.type === 'event_invite' && !notification.isRead && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    className="choice-chip bg-gradient-to-r from-green-500 to-emerald-400 text-white border-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptInvite(notification);
                                    }}
                                  >
                                    <Check size={14} className="mr-1" />
                                    Accept
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="choice-chip"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeclineInvite(notification);
                                    }}
                                  >
                                    <X size={14} className="mr-1" />
                                    Decline
                                  </Button>
                                </div>
                              )}

                              {notification.type === 'connection' && !notification.isRead && (
                                <div className="flex gap-2">
                                  <Button size="sm" className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
                                    Accept
                                  </Button>
                                  <Button variant="outline" size="sm" className="choice-chip">
                                    Decline
                                  </Button>
                                </div>
                              )}
                              
                              {notification.type === 'message' && (
                                <Button variant="outline" size="sm" className="choice-chip">
                                  Reply
                                </Button>
                              )}
                              
                              {notification.type === 'activity' && (
                                <Button variant="outline" size="sm" className="choice-chip">
                                  View Activity
                                </Button>
                              )}
                              
                              {notification.type === 'reminder' && (
                                <Button size="sm" className="choice-chip bg-gradient-to-r from-green-500 to-emerald-400 text-white border-0">
                                  Join Now
                                </Button>
                              )}

                              {notification.actionUrl && (
                                <Button variant="ghost" size="sm" className="p-1">
                                  <ChevronRight size={16} className="text-gray-400" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Clear All Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Clear All Notifications</DialogTitle>
              <DialogDescription>
                This will permanently delete all your notifications and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. All notifications will be permanently deleted.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={clearAllNotifications}>
                  Clear All
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Stats */}
        {notifications.length > 0 && (
          <Card className="glass-card p-4 mt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl gradient-text mb-1">{notifications.filter(n => !n.isArchived).length}</div>
                <div className="text-subtext">Total</div>
              </div>
              <div>
                <div className="text-2xl text-blue-500 mb-1">{unreadCount}</div>
                <div className="text-subtext">Unread</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Event Details Modal for Invites */}
      <EventDetailsModal
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        event={selectedEvent}
        onAccept={handleAcceptFromModal}
        onDecline={handleDeclineFromModal}
      />
    </div>
  );
}