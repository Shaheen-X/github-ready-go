import React from 'react';
import { Button } from './ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '@/types/calendar';

interface EventSummaryCardProps {
  events: CalendarEvent[];
  onViewAll: () => void;
  onEventClick: () => void;
  onStartChat?: (eventId: string | number) => void;
}

const EventSummaryCard: React.FC<EventSummaryCardProps> = ({ 
  events, 
  onViewAll, 
  onEventClick,
  onStartChat 
}) => {
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
          <p className="text-subtext">{events.length} scheduled {events.length === 1 ? 'activity' : 'activities'}</p>
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
          <EventCard
            key={event.id}
            event={event}
            variant="compact"
            onClick={onEventClick}
            onStartChat={onStartChat}
          />
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