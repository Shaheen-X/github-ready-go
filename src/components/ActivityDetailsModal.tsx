import { MapPin, Clock, Users, MessageCircle, Crown, Edit, Trash2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CalendarEventDetails, RSVPStatus } from './EventDetailsModal';

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventDetails | null;
  onAccept?: (eventId: string | number) => void;
  onDecline?: (eventId: string | number) => void;
  onEdit?: (eventId: string | number) => void;
  onDelete?: (eventId: string | number) => void;
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

export default function ActivityDetailsModal({ 
  isOpen, 
  onClose, 
  event,
  onAccept,
  onDecline,
  onEdit,
  onDelete
}: ActivityDetailsModalProps) {
  const isGroup = event?.type === 'group';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
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
            <DialogDescription className="sr-only">View event details and respond to the invitation</DialogDescription>
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

            {/* Host Profile Section - Only show if not the host */}
            {!event?.isHost && event?.hostName && (
              <div className="glass-card p-4 rounded-xl border border-white/20">
                <h4 className="text-body font-semibold mb-3">Host</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground font-semibold">{event.hostName}</div>
                    <div className="text-xs text-subtext">Event Organizer</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Navigate to host profile
                      window.location.href = `/profile/${event.hostId}`;
                    }}
                    className="rounded-full"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            )}

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
                {event.isHost ? (
                  <>
                    <Button 
                      onClick={() => onEdit?.(event.id)} 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full"
                    >
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                    <Button 
                      onClick={() => onDelete?.(event.id)} 
                      variant="outline" 
                      className="flex-1 rounded-full border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                    <Button 
                      onClick={() => {
                        window.location.href = `/chat/${event.id}`;
                      }} 
                      variant="outline" 
                      className="rounded-full"
                    >
                      <MessageCircle size={16} className="mr-2" /> Chat
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => onAccept?.(event.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full">
                      Accept
                    </Button>
                    <Button onClick={() => onDecline?.(event.id)} variant="outline" className="flex-1 rounded-full">
                      Decline
                    </Button>
                    <Button 
                      onClick={() => {
                        window.location.href = `/chat/${event.id}`;
                      }} 
                      variant="outline" 
                      className="rounded-full"
                    >
                      <MessageCircle size={16} className="mr-2" /> Chat
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}