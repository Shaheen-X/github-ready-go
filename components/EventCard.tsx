import { Clock, MapPin, Users, Crown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CalendarEvent } from '@/types/calendar';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

export const EventCard = ({ event, onClick, variant = 'default' }: EventCardProps) => {
  const acceptedAttendees = event.attendees.filter(
    (attendee) => attendee.status === 'accepted'
  ).length;
  const isHost = event.isHost;

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white shadow-xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Event Image with Compact 3:2 Ratio */}
      <div className="relative w-full" style={{ aspectRatio: variant === 'compact' ? '3/2' : '16/9' }}>
        {event.image ? (
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Host Badge */}
        {isHost && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-semibold shadow-lg">
              <Crown className="w-3 h-3" />
              <span>Host</span>
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide">
            {event.type === 'group' ? 'Group' : '1:1'}
          </span>
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-2 text-xs text-white/90 mb-1">
            <Clock className="h-3 w-3" />
            <span>{event.time}</span>
            {event.endTime && <span>- {event.endTime}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/90">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-3 py-2 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Users className="h-3.5 w-3.5 text-blue-500" />
          <span>{acceptedAttendees}/{event.maxParticipants || '∞'}</span>
        </div>
        <div className="text-xs text-blue-600 font-medium">
          View details →
        </div>
      </div>
    </div>
  );
};
