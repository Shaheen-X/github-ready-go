import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Users, MessageCircle, Crown, Check, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CalendarEvent } from '@/types/calendar';

export type RSVPStatus = 'accepted' | 'declined' | 'pending';

export interface Attendee {
  id: string;
  name: string;
  avatar: string;
  status: RSVPStatus;
}

export interface CalendarEventDetails extends Omit<CalendarEvent, 'date'> {
  date: string; // formatted date string for display
}

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  event: CalendarEventDetails | null;
  onAccept?: (eventId: string | number) => void;
  onDecline?: (eventId: string | number) => void;
  onStartChat?: (eventId: string | number) => void;
}

const statusBadge = (status: RSVPStatus) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'declined':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ open, onOpenChange, event, onAccept, onDecline }) => {
  const isGroup = event?.type === 'group';
  const navigate = useNavigate();
  
  // Check if this is a pending invite (user hasn't responded yet)
  const userAttendee = event?.attendees.find(a => a.name === 'You');
  const isPendingInvite = userAttendee?.status === 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 max-w-lg max-h-[95vh] p-0">
        <div className="glass-card flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${isGroup ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'} flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold gradient-text">{event?.title || 'Event'}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">View details and respond to the event invitation</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {event?.image && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover" />
                
                {/* Activity Tag */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg">
                    {event.activity}
                  </span>
                </div>

                {/* Host Badge */}
                {event?.isHost && (
                  <div className="absolute top-2 left-20">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                      <Crown className="w-3 h-3" />
                      <span>Host</span>
                    </div>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wide border border-white/30">
                    {isGroup ? 'Group' : '1:1'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-subtext">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{event?.date} • {event?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event?.location}</span>
              </div>
            </div>

            {event?.description && (
              <div>
                <h4 className="text-body font-semibold mb-1">Description</h4>
                <p className="text-subtext">{event.description}</p>
              </div>
            )}

            {event?.attendees && event.attendees.length > 0 && (
              <div>
                <h4 className="text-body font-semibold mb-2">Attendees</h4>
                <div className="space-y-2">
                  {event.attendees.map(a => (
                    <div key={a.id} className="flex items-center gap-3">
                      <ImageWithFallback src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="text-sm text-foreground font-medium">{a.name}</div>
                      </div>
                      <Badge className={`${statusBadge(a.status)} border-0 capitalize`}>{a.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-white/20 flex items-center gap-2">
            {event && (
              <>
                {isPendingInvite ? (
                  /* Show Accept/Decline for pending invites */
                  <>
                    <Button 
                      onClick={() => onAccept?.(event.id)} 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full"
                    >
                      <Check size={16} className="mr-2" />
                      Accept Invite
                    </Button>
                    <Button 
                      onClick={() => onDecline?.(event.id)} 
                      variant="outline" 
                      className="flex-1 rounded-full"
                    >
                      <X size={16} className="mr-2" />
                      Decline
                    </Button>
                  </>
                ) : (
                  /* Show Chat button for accepted events */
                  <Button 
                    onClick={() => {
                      navigate(`/chat/${event.id}`);
                    }} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full"
                  >
                    <MessageCircle size={16} className="mr-2" /> 
                    Open Chat
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
