import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Users, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export type RSVPStatus = 'accepted' | 'declined' | 'pending';

export interface Attendee {
  id: string;
  name: string;
  avatar: string;
  status: RSVPStatus;
}

export interface CalendarEventDetails {
  id: string | number;
  title: string;
  type: 'pairing' | 'group' | string;
  date: string; // formatted date string for display
  time: string; // formatted time string for display
  location: string;
  description?: string;
  attendees?: Attendee[];
  image?: string;
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

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ open, onOpenChange, event, onAccept, onDecline, onStartChat }) => {
  const isGroup = event?.type === 'group';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 max-w-lg max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
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
              <div className="w-full h-40 rounded-2xl overflow-hidden">
                <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge className={`${isGroup ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'} border-0`}>{isGroup ? 'Group' : '1:1'}</Badge>
            </div>

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
                <Button onClick={() => onAccept?.(event.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full">
                  Accept
                </Button>
                <Button onClick={() => onDecline?.(event.id)} variant="outline" className="flex-1 rounded-full">
                  Decline
                </Button>
                <Button onClick={() => onStartChat?.(event.id)} variant="outline" className="rounded-full">
                  <MessageCircle size={16} className="mr-2" /> Chat
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
