import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Clock, Users, Crown, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

interface PastEventDetailsModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  event: CalendarEvent | null;
  onDelete?: () => void;
}

export const PastEventDetailsModal: React.FC<PastEventDetailsModalProps> = ({ 
  open, 
  onOpenChange, 
  event,
  onDelete
}) => {
  const isGroup = event?.type === 'group';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 max-w-lg max-h-[95vh] p-0">
        <div className="glass-card flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${isGroup ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'} flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold gradient-text">{event?.title || 'Event'}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">View past event details</DialogDescription>
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

                {/* Completed Badge */}
                <div className="absolute bottom-2 right-2">
                  <span className="px-2 py-1 rounded-full bg-gray-600/80 backdrop-blur-sm text-white text-xs font-semibold">
                    Completed
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-subtext">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{event?.date ? format(event.date, 'MMM d, yyyy') : ''} • {event?.time}</span>
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
                <h4 className="text-body font-semibold mb-2">Attendees ({event.attendees.length})</h4>
                <div className="space-y-2">
                  {event.attendees.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center gap-3">
                      {a.avatar ? (
                        <ImageWithFallback src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-semibold">
                          {a.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-foreground font-medium">{a.name}</div>
                      </div>
                    </div>
                  ))}
                  {event.attendees.length > 5 && (
                    <div className="text-sm text-muted-foreground ml-11">
                      +{event.attendees.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-white/20 flex items-center gap-2">
            <Button 
              onClick={onDelete}
              variant="destructive" 
              className="flex-1 rounded-full"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Event
            </Button>
            <Button 
              onClick={() => onOpenChange?.(false)}
              variant="outline" 
              className="flex-1 rounded-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PastEventDetailsModal;
