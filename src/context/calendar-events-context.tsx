import { createContext, useContext, useState, ReactNode } from 'react';
import type { CalendarEvent, EventAttendee } from '@/types/calendar';

interface CalendarEventsContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  addEvents: (events: CalendarEvent[]) => void;
  removeEvent: (id: string) => void;
  respondToInvitation: (eventId: string, status: 'accepted' | 'declined') => void;
  pinEventToChat: (eventId: string) => void;
  setHighlightedDate: (date: Date | null) => void;
  deleteEvent: (id: string) => void;
}

export const createEventFromInput = (
  data: Partial<CalendarEvent> & { title: string; date: Date; time: string },
  id?: string
): CalendarEvent => {
  return {
    id: id || `event-${Date.now()}`,
    title: data.title,
    date: data.date,
    time: data.time,
    type: data.type || 'activity',
    location: data.location,
    description: data.description,
    attendees: data.attendees || [],
    maxParticipants: data.maxParticipants,
    tags: data.tags,
    image: data.image,
    isHost: true,
    status: 'confirmed',
  };
};

const CalendarEventsContext = createContext<CalendarEventsContextType | undefined>(undefined);

export const CalendarEventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const addEvents = (newEvents: CalendarEvent[]) => {
    setEvents((prev) => [...prev, ...newEvents]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const respondToInvitation = (eventId: string, status: 'accepted' | 'declined') => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, status: status === 'accepted' ? 'confirmed' : 'cancelled' }
          : event
      )
    );
  };

  const pinEventToChat = (eventId: string) => {
    console.log('Pinning event to chat:', eventId);
  };

  const setHighlightedDate = (date: Date | null) => {
    console.log('Setting highlighted date:', date);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <CalendarEventsContext.Provider
      value={{
        events,
        addEvent,
        addEvents,
        removeEvent,
        respondToInvitation,
        pinEventToChat,
        setHighlightedDate,
        deleteEvent,
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

export const useCalendarEvents = () => {
  const context = useContext(CalendarEventsContext);
  if (context === undefined) {
    throw new Error('useCalendarEvents must be used within a CalendarEventsProvider');
  }
  return context;
};
