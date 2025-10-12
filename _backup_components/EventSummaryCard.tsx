import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  activity: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  maxParticipants: number;
  isHost: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface EventSummaryCardProps {
  events: Event[];
  onViewAll: () => void;
  onEventClick: (eventId: string) => void;
}

const EventSummaryCard: React.FC<EventSummaryCardProps> = ({ 
  events, 
  onViewAll, 
  onEventClick 
}) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-gradient-to-r from-green-500 to-emerald-400';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-pink-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (events.length === 0) {
    return (
      <div className="glass-card p-6 text-center card-enter">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-section-header gradient-text mb-2">No Events Scheduled</h3>
        <p className="text-subtext mb-4">Create your first activity and start connecting!</p>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full px-6 py-2 btn-scale"
        >
          Create Activity
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 card-enter">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-section-header gradient-text">My Events</h2>
          <p className="text-subtext">{events.length} scheduled activities</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gradient-text"
          onClick={onViewAll}
        >
          View all
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {events.slice(0, 2).map((event) => (
          <div 
            key={event.id}
            className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 cursor-pointer hover:shadow-lg"
            onClick={() => onEventClick(event.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-body font-semibold">{event.title}</h3>
                  {event.isHost && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      Host
                    </Badge>
                  )}
                </div>
                <Badge 
                  className={`${getStatusColor(event.status)} text-white text-xs border-0 capitalize`}
                >
                  {event.activity}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-subtext">
                <Calendar size={12} />
                <span className="text-xs">{formatDate(event.date)} at {event.time}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-subtext">
                <MapPin size={12} />
                <span className="text-xs">{event.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-subtext">
                  <Users size={12} />
                  <span className="text-xs">
                    {event.attendees}/{event.maxParticipants} attending
                  </span>
                </div>
                
                {/* Progress bar for attendance */}
                <div className="flex-1 max-w-[60px] ml-3">
                  <div className="w-full bg-gray-200 h-1.5 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(event.attendees / event.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length > 2 && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-subtext border-gray-200 hover:border-blue-300 hover:text-blue-600"
            onClick={onViewAll}
          >
            +{events.length - 2} more events
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventSummaryCard;