import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  MessageCircle,
  Users,
  MoreVertical,
  Edit,
  Megaphone,
  CalendarPlus,
  Trash2,
  Share2,
  UserPlus,
  Search,
} from 'lucide-react';
import { EventCard } from './EventCard';
import type { WeekNumberProps } from 'react-day-picker';
import { toast } from 'sonner';

import { ImageWithFallback } from './figma/ImageWithFallback';
import CreateActivityModal from './CreateActivityModal';

import { useCalendarEvents } from '@/context/calendar-events-context';
import type { CalendarEvent } from '@/types/calendar';
import { userConnections } from '@/data/calendar-events';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar as DayPickerCalendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { cn } from './ui/utils';

interface CalendarProps {
  onNavigate?: (tab: string) => void;
  onCreateEvent?: () => void;
  onCreatePairing?: () => void;
  onCreateGroup?: () => void;
}

type DialogSurface = 'dialog' | 'sheet';



const parseEventDateTime = (event: CalendarEvent) => {
  const [timeValue, period] = event.time.split(' ');
  const [rawHour, rawMinute = '00'] = timeValue.split(':');
  const parsedHour = Number(rawHour);
  const parsedMinute = Number(rawMinute);
  const normalizedHour =
    period?.toLowerCase() === 'pm' && parsedHour < 12
      ? parsedHour + 12
      : period?.toLowerCase() === 'am' && parsedHour === 12
      ? 0
      : parsedHour;

  const value = new Date(event.date);
  value.setHours(normalizedHour, parsedMinute, 0, 0);
  return value.getTime();
};

export function Calendar({ onNavigate: _onNavigate }: CalendarProps = {}) {
  const navigate = useNavigate();
  const {
    events,
    respondToInvitation,
    pinEventToChat,
    setHighlightedDate,
    deleteEvent,
    updateEvent,
  } = useCalendarEvents();
  const isMobile = useIsMobile();
  const dialogSurface: DialogSurface = isMobile ? 'sheet' : 'dialog';

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDayEvents, setActiveDayEvents] = useState<CalendarEvent[]>([]);
  const [isEventViewerOpen, setIsEventViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
  }, [events, searchTerm]);

  useEffect(() => {
    if (!isEventViewerOpen) {
      setActiveDayEvents([]);
    }
  }, [isEventViewerOpen]);

  const upcomingEvents = useMemo(
    () =>
      filteredEvents
        .filter((event) => event.status === 'upcoming')
        .sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b)),
    [filteredEvents],
  );


  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    filteredEvents.forEach((event) => {
      const key = event.date.toDateString();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [filteredEvents]);

  const agendaSections = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    upcomingEvents.forEach((event) => {
      const key = event.date.toDateString();
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    });

    return Array.from(grouped.entries())
      .map(([key, list]) => ({
        date: new Date(key),
        events: [...list].sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b)),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [upcomingEvents]);

  const handleDaySelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    setHighlightedDate(date);
  };

  const openDayEvents = (date: Date, specificEvent?: CalendarEvent) => {
    const key = date.toDateString();
    const dateEvents = eventsByDate.get(key) ?? [];
    if (dateEvents.length === 0) return;
    setSelectedDate(date);
    // If a specific event is provided, only show that event
    setActiveDayEvents(specificEvent ? [specificEvent] : dateEvents);
    setIsEventViewerOpen(true);
  };

  const handleAgendaSelect = (event: CalendarEvent) => {
    openDayEvents(event.date, event);
  };

  const handleAccept = (event: CalendarEvent) => {
    respondToInvitation(event.id, 'You', 'accepted');
    setHighlightedDate(event.date);
    toast.success('Added to calendar—chat pinned!', {
      description: `${event.title} • ${event.time}`,
    });
  };

  const handleDecline = (event: CalendarEvent) => {
    respondToInvitation(event.id, 'You', 'declined');
    toast('RSVP updated', {
      description: `Declined ${event.title}. We let the host know.`,
    });
  };

  const handleStartChat = (event: CalendarEvent) => {
    pinEventToChat(event.id);
    toast.success('Chat pinned for this event', {
      description: `${event.title} • ${event.attendees.length} RSVPs`,
    });
    navigate(`/chat/${event.id}`);
    setHighlightedDate(event.date);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (eventData: any) => {
    if (!editingEvent) return;
    
    // Update the event with new data
    updateEvent(editingEvent.id, {
      title: eventData.eventName,
      activity: eventData.activity,
      description: eventData.description || '',
      date: new Date(eventData.date),
      time: eventData.time,
      location: eventData.location,
      maxParticipants: eventData.maxParticipants ? Number(eventData.maxParticipants) : null,
      isPrivate: eventData.visibility === 'private',
      image: eventData.selectedImage || editingEvent.image,
    });
    
    toast.success('Event updated successfully!', {
      description: `${eventData.eventName} has been updated`,
    });
    setIsEditModalOpen(false);
    setEditingEvent(null);
    setIsEventViewerOpen(false);
  };

  const handleShareEvent = (event: CalendarEvent) => {
    // Copy event link to clipboard
    const eventUrl = `https://connectsphere.app/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl).then(() => {
      toast.success('Event link copied!', {
        description: 'Share this link with others to invite them',
      });
    }).catch(() => {
      toast.success('Share event', {
        description: `Share ${event.title} with your friends`,
      });
    });
  };

  const handleInviteToEvent = (event: CalendarEvent) => {
    toast.success('Invite sent!', {
      description: `Invitation to ${event.title} sent to your contacts`,
    });
    // In real app, this would open invite modal or contacts picker
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    deleteEvent(event.id);
    setIsEventViewerOpen(false);
    toast.error('Event deleted', {
      description: `${event.title} has been cancelled and removed.`
    });
  };

  const handleViewAllUpcoming = () => {
    // Show agenda view with all upcoming events
    setViewMode('agenda');
    toast.success('Showing all upcoming events', {
      description: 'Switched to agenda view',
    });
  };

  const renderDots = (date: Date) => {
    const key = date.toDateString();
    const dateEvents = eventsByDate.get(key) ?? [];
    if (dateEvents.length === 0) return null;

    const groupEvents = dateEvents.filter((event) => event.type === 'group');
    const oneToOneEvents = dateEvents.filter((event) => event.type === 'one-to-one');
    const groupOverflow = Math.max(groupEvents.length - 3, 0);
    const ariaLabel = `${dateEvents.length} scheduled ${
      dateEvents.length === 1 ? 'event' : 'events'
    }`;

    // Helper function to get dot color based on user's status
    const getDotColor = (event: CalendarEvent) => {
      const userAttendee = event.attendees.find(a => a.id === 'att-you');
      if (!userAttendee) return 'bg-gray-400'; // Not invited
      
      switch (userAttendee.status) {
        case 'accepted':
          return 'bg-green-500';
        case 'pending':
          return 'bg-yellow-500';
        case 'declined':
          return 'bg-red-400';
        default:
          return 'bg-gray-400';
      }
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          openDayEvents(date);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            openDayEvents(date);
          }
        }}
        className="absolute bottom-1 right-1 flex flex-col items-end gap-0.5"
        aria-label={ariaLabel}
      >
        {oneToOneEvents.length > 0 && (
          <span className={`h-3 w-3 rounded-full ${getDotColor(oneToOneEvents[0])}`} />
        )}
        {groupEvents.length > 0 && (
          <div className="flex flex-col items-end gap-0.5">
            {groupEvents.slice(0, 3).map((event, index) => (
              <span
                key={event.id + index}
                className={`h-3 w-3 rounded-full ${getDotColor(event)}`}
              />
            ))}
            {groupOverflow > 0 && (
              <span className="rounded-full border border-yellow-200 bg-white px-1 text-[10px] font-semibold leading-none text-yellow-600">
                +{groupOverflow}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const dayContent = ({ date }: { date: Date }) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    return (
      <div className="relative flex h-8 w-8 items-center justify-center">
        <span
          className={cn(
            'text-xs font-medium',
            isToday && !isSelected && 'text-blue-600',
            isSelected && 'text-white',
          )}
        >
          {date.getDate()}
        </span>
        {renderDots(date)}
      </div>
    );
  };

  const renderWeekNumber = ({ number }: WeekNumberProps) => (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      W{number.toString().padStart(2, '0')}
    </span>
  );

  const firstUpcoming = upcomingEvents.slice(0, 3);

  const viewToggleOptions: { label: string; value: 'month' | 'agenda' }[] = [
    { label: 'Month', value: 'month' },
    { label: 'Agenda', value: 'agenda' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="glass-card sticky top-0 z-10 mx-4 mt-4 rounded-2xl border-b border-white/20 px-4 py-4">
        <h1 className="text-app-title gradient-text">Calendar</h1>
      </div>

      <div className="space-y-6 p-4 pb-24">
        <Card className="glass-card border border-white/30 shadow-xl">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center rounded-full bg-white/70 p-1 shadow-inner backdrop-blur">
                {viewToggleOptions.map(({ label, value }) => (
                  <Button
                    key={value}
                    variant="ghost"
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-semibold transition',
                      viewMode === value
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                        : 'text-subtext hover:text-foreground',
                    )}
                    onClick={() => setViewMode(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="rounded-full px-4 text-xs"
                onClick={() => {
                  const today = new Date();
                  setSelectedDate(today);
                  setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setViewMode('month');
                }}
              >
                Today
              </Button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {viewMode === 'month' ? (
              <DayPickerCalendar
                mode="single"
                showWeekNumber
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                selected={selectedDate}
                onSelect={handleDaySelect}
                components={{ DayContent: dayContent, WeekNumber: renderWeekNumber }}
                classNames={{
                  months: 'flex flex-col gap-4',
                  month: 'space-y-4',
                  caption:
                    'flex items-center justify-center rounded-xl bg-white/60 px-4 py-3 text-slate-700 backdrop-blur relative',
                  caption_label: 'text-base font-semibold',
                  nav: 'absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2',
                  table: 'w-full border-collapse',
                  head_row: 'flex items-center gap-1 border-b border-white/40 pb-2',
                  head_cell:
                    'flex-1 text-center text-[11px] font-semibold uppercase tracking-wide text-subtext',
                  row: 'flex items-center gap-1',
                  cell:
                    'relative flex-1 rounded-xl p-0 transition hover:bg-white/70 focus-within:bg-white/80',
                  day: 'flex h-9 w-full items-center justify-center rounded-xl text-sm font-medium text-slate-600 aria-selected:text-white aria-selected:shadow-lg',
                  day_selected:
                    'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-500 hover:to-cyan-400',
                  day_today: 'text-blue-600 font-semibold',
                  weeknumber:
                    'order-last ml-3 flex h-9 min-w-12 items-center justify-center border-l border-white/60 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
                }}
              />
            ) : (
              <AgendaTimeline 
                sections={agendaSections} 
                onSelectEvent={handleAgendaSelect}
              />
            )}
          </CardContent>
        </Card>

        {viewMode === 'month' && (
          <>
            <Card className="glass-card border border-white/30 shadow-xl">
              <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-section-header gradient-text">
                    Events on{' '}
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardTitle>
                  <p className="text-subtext text-sm">
                    {eventsByDate.get(selectedDate.toDateString())?.length ?? 0} upcoming
                    {(eventsByDate.get(selectedDate.toDateString())?.length ?? 0) === 1
                      ? ' event'
                      : ' events'}
                  </p>
                </div>
                <Badge className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1 text-xs text-white shadow-md">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                {(eventsByDate.get(selectedDate.toDateString()) ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white/75 p-6 text-center shadow-inner">
                    <CalendarIcon className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-body font-semibold">No events yet</p>
                    <p className="text-subtext text-sm">
                      Start your own!
                    </p>
                  </div>
                ) : (
                  (eventsByDate.get(selectedDate.toDateString()) ?? []).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      onClick={() => openDayEvents(event.date, event)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <SummarySections
              upcoming={firstUpcoming}
              onOpenEvent={openDayEvents}
              onViewAll={handleViewAllUpcoming}
            />
          </>
        )}
      </div>

      {dialogSurface === 'dialog' ? (
        <Dialog open={isEventViewerOpen} onOpenChange={setIsEventViewerOpen}>
          <DialogContent className="max-w-xl rounded-2xl p-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-lg font-semibold gradient-text">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </DialogTitle>
              <DialogDescription className="text-subtext text-sm">
                {activeDayEvents.length} planned
                {activeDayEvents.length === 1 ? ' event' : ' events'}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6">
              <EventCards
                events={activeDayEvents}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onStartChat={handleStartChat}
                onEditEvent={handleEditEvent}
                onShareEvent={handleShareEvent}
                onInviteToEvent={handleInviteToEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isEventViewerOpen} onOpenChange={setIsEventViewerOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl bg-white/95 backdrop-blur">
            <SheetHeader>
              <SheetTitle className="gradient-text text-lg">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </SheetTitle>
              <SheetDescription className="text-subtext">
                Tap an event to respond or start a chat.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <EventCards
                events={activeDayEvents}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onStartChat={handleStartChat}
                onEditEvent={handleEditEvent}
                onShareEvent={handleShareEvent}
                onInviteToEvent={handleInviteToEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <CreateActivityModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEvent(null);
          }}
          onCreateActivity={handleSaveEdit}
          editMode={true}
          initialData={{
            eventName: editingEvent.title,
            activity: editingEvent.activity,
            description: editingEvent.description,
            date: editingEvent.date.toISOString().split('T')[0],
            time: editingEvent.time,
            location: editingEvent.location,
            maxParticipants: editingEvent.maxParticipants,
            isPrivate: editingEvent.isPrivate,
            image: editingEvent.image,
          }}
        />
      )}
    </div>
  );
}

interface AgendaSection {
  date: Date;
  events: CalendarEvent[];
}

interface AgendaTimelineProps {
  sections: AgendaSection[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const AgendaTimeline = ({ sections, onSelectEvent }: AgendaTimelineProps) => {
  if (sections.length === 0) {
    return (
      <div className="rounded-2xl bg-white/75 p-6 text-center text-subtext shadow-inner">
        No upcoming events for the next days. Start planning to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.date.toISOString()} className="grid gap-4 md:grid-cols-[120px_1fr]">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-subtext">
              {section.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-white text-lg font-semibold text-slate-700 shadow-inner">
              {section.date.getDate()}
            </span>
            <span className="text-xs text-subtext">
              {section.date.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
          <div className="relative flex-1">
            <div
              className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue-200 via-cyan-200 to-blue-200"
              aria-hidden="true"
            />
            <div className="space-y-3 pl-10">
              {section.events.map((event, index) => (
                <div key={`${event.id}-${index}`} className="relative">
                  <span className="absolute -left-6 top-6 size-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow" />
                  <EventCard
                    event={event}
                    variant="compact"
                    onClick={() => onSelectEvent(event)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface EventCardsProps {
  events: CalendarEvent[];
  onAccept: (event: CalendarEvent) => void;
  onDecline: (event: CalendarEvent) => void;
  onStartChat: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onShareEvent: (event: CalendarEvent) => void;
  onInviteToEvent: (event: CalendarEvent) => void;
}

interface EventCardsProps {
  events: CalendarEvent[];
  onAccept: (event: CalendarEvent) => void;
  onDecline: (event: CalendarEvent) => void;
  onStartChat: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onShareEvent: (event: CalendarEvent) => void;
  onInviteToEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const EventCards = ({ events, onAccept, onDecline, onStartChat, onEditEvent, onShareEvent, onInviteToEvent, onDeleteEvent }: EventCardsProps) => {
  const statusColors = {
    accepted: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    declined: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const isHost = event.isHost;
        const acceptedAttendees = event.attendees.filter((a) => a.status === 'accepted');
        
        // Privacy logic: If not host, only show connected attendees
        const visibleAttendees = isHost 
          ? event.attendees 
          : event.attendees.filter(attendee => 
              attendee.id === 'att-you' || userConnections.includes(attendee.id)
            );
        
        const visibleAcceptedAttendees = visibleAttendees.filter((a) => a.status === 'accepted');
        const visiblePendingAttendees = visibleAttendees.filter((a) => a.status === 'pending');
        const visibleDeclinedAttendees = visibleAttendees.filter((a) => a.status === 'declined');
        
        const totalAttendingCount = acceptedAttendees.length;
        const userAttendee = event.attendees.find(a => a.id === 'att-you');

        return (
          <div key={event.id} className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* 16:9 Event Image */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
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
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              
              {/* Host Badge */}
              {isHost && (
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                    👑 Host
                  </div>
                </div>
              )}

              {/* Three Dots Menu */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-white/20 w-48">
                    {isHost ? (
                      // Host options
                      <>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                          onClick={() => onEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-purple-600 hover:bg-purple-50"
                          onClick={() => {
                            toast.success('Event announced!', {
                              description: `Sent announcement for ${event.title} to all attendees.`
                            });
                          }}
                        >
                          <Megaphone className="w-4 h-4" />
                          Announce
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-green-600 hover:bg-green-50"
                          onClick={() => {
                            toast.success('Added to calendar!', {
                              description: `${event.title} saved to your device calendar.`
                            });
                          }}
                        >
                          <CalendarPlus className="w-4 h-4" />
                          Add to Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                          onClick={() => onDeleteEvent(event)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    ) : (
                      // Non-host options - only add to external calendar
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-green-600 hover:bg-green-50"
                        onClick={() => {
                          toast.success('Added to calendar!', {
                            description: `${event.title} saved to your device calendar.`
                          });
                        }}
                      >
                        <CalendarPlus className="w-4 h-4" />
                        Add to Calendar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Event Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent">
                <div className="space-y-3">
                  {/* Activity and Privacy */}
                  <div className="flex items-center gap-2">
                    <span className="choice-chip selected text-xs px-3 py-1">
                      {event.activity}
                    </span>
                    {event.type === 'group' && (
                      <span className={cn(
                        "choice-chip text-xs px-3 py-1",
                        event.isPrivate ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                      )}>
                        {event.isPrivate ? 'Private' : 'Public'}
                      </span>
                    )}
                  </div>
                  
                  {/* Event Title */}
                  <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                  
                  {/* Event Details */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      📅 {event.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })} at {event.time}
                    </p>
                    <p className="text-sm text-gray-600">📍 {event.location}</p>
                    {event.hostName && !isHost && (
                      <p className="text-sm text-gray-600">👤 Hosted by {event.hostName}</p>
                    )}
                    {event.isRepeating && (
                      <p className="text-sm text-gray-600">🔄 Repeats {event.repeatFrequency}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>

              {/* Attendees Section - Different for Host vs Participant */}
              {isHost ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">Event Attendees</h4>
                  
                  {/* Accepted Attendees */}
                  {visibleAcceptedAttendees.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-700">
                          Accepted ({visibleAcceptedAttendees.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {visibleAcceptedAttendees.map((attendee) => (
                          <div key={attendee.id} className="text-sm text-gray-700 bg-green-50 px-2 py-1 rounded-lg">
                            {attendee.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Attendees */}
                  {visiblePendingAttendees.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs font-medium text-yellow-700">
                          Pending ({visiblePendingAttendees.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {visiblePendingAttendees.map((attendee) => (
                          <div key={attendee.id} className="text-sm text-gray-700 bg-yellow-50 px-2 py-1 rounded-lg">
                            {attendee.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Declined Attendees */}
                  {visibleDeclinedAttendees.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs font-medium text-red-700">
                          Declined ({visibleDeclinedAttendees.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {visibleDeclinedAttendees.map((attendee) => (
                          <div key={attendee.id} className="text-sm text-gray-700 bg-red-50 px-2 py-1 rounded-lg">
                            {attendee.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    {event.maxParticipants 
                      ? `${totalAttendingCount}/${event.maxParticipants} spots filled`
                      : `${totalAttendingCount} attending (unlimited spots)`
                    }
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Attendees</h4>
                  
                  {/* Show total count and user's status */}
                  <div className="space-y-1.5">
                    <div className="text-sm text-gray-600">
                      {totalAttendingCount} {totalAttendingCount === 1 ? 'person' : 'people'} attending
                      {event.maxParticipants && ` (${event.maxParticipants} max)`}
                    </div>
                    
                    {userAttendee && (
                      <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Your Status:</span>
                        <Badge
                          className={cn(
                            'rounded-full border-0 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                            statusColors[userAttendee.status],
                          )}
                        >
                          {userAttendee.status}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Show connections who are attending */}
                    {visibleAttendees.filter(a => a.id !== 'att-you').length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">Your connections attending:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {visibleAttendees.filter(a => a.id !== 'att-you').map((attendee) => (
                            <div key={attendee.id} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-lg flex items-center justify-between">
                              <span>{attendee.name}</span>
                              <Badge
                                className={cn(
                                  'rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold',
                                  statusColors[attendee.status],
                                )}
                              >
                                {attendee.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}



              {/* Action Buttons */}
              <div className="space-y-3">
                {/* RSVP Status Display and Actions */}
                {!isHost && userAttendee && (
                  <>
                    {userAttendee.status === 'accepted' && (
                      <div className="text-center bg-green-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-green-700">✓ You're attending this event</span>
                      </div>
                    )}
                    
                    {userAttendee.status === 'pending' && (
                      <div className="space-y-2">
                        <div className="text-center bg-yellow-50 px-4 py-2 rounded-lg">
                          <span className="text-sm font-medium text-yellow-700">⏳ RSVP Required</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                            onClick={() => onAccept(event)}
                          >
                            ✓ Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onDecline(event)}
                          >
                            ✗ Decline
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {userAttendee.status === 'declined' && (
                      <div className="text-center bg-red-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-red-700">✗ You declined this event</span>
                      </div>
                    )}
                  </>
                )}

                {/* Universal Action Buttons - only show if not pending */}
                {(!userAttendee || userAttendee.status !== 'pending') && (
                  <div className="flex gap-2">
                    {/* Share button - hide for private events if not host */}
                    {(!event.isPrivate || isHost) && (
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => onShareEvent(event)}
                      >
                        <Share2 className="mr-2 w-4 h-4" />
                        Share
                      </Button>
                    )}
                    
                    {/* Invite button - hide for private events if not host */}
                    {(!event.isPrivate || isHost) && (
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => onInviteToEvent(event)}
                      >
                        <UserPlus className="mr-2 w-4 h-4" />
                        Invite
                      </Button>
                    )}
                    
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      onClick={() => onStartChat(event)}
                    >
                      <MessageCircle className="mr-2 w-4 h-4" />
                      Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface SummarySectionsProps {
  upcoming: CalendarEvent[];
  onOpenEvent: (date: Date) => void;
  onViewAll: () => void;
}

const SummarySections = ({ upcoming, onOpenEvent, onViewAll }: SummarySectionsProps) => {
  const renderEmpty = (message: string) => (
    <p className="text-subtext text-sm">{message}</p>
  );

  return (
    <div className="w-full">
      <Card className="glass-card overflow-hidden border border-white/30 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <CardTitle className="text-body font-semibold text-foreground">
                Next Up
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-blue-600 hover:bg-blue-50 rounded-full px-3"
              onClick={onViewAll}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {upcoming.length === 0
            ? renderEmpty('No upcoming events yet.')
            : upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="compact"
                  onClick={() => onOpenEvent(event.date)}
                />
              ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;