import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  type CalendarEvent,
  type EventAttendee,
  type EventType,
  type NewEventInput,
  type RSVPStatus,
} from '../types/calendar';
import { initialCalendarEvents } from '../data/calendar-events';

interface WizardOptions {
  type?: EventType;
  templateId?: string;
  date?: Date;
}

interface CalendarEventsContextValue {
  events: CalendarEvent[];
  addEvents: (events: CalendarEvent[]) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  respondToInvitation: (eventId: string, attendeeName: string, status: RSVPStatus) => void;
  pinEventToChat: (eventId: string) => void;
  clearPinnedEvent: () => void;
  pinnedEvent?: CalendarEvent;
  highlightedDate: Date | null;
  setHighlightedDate: (date: Date | null) => void;
  openWizard: (options?: WizardOptions) => void;
  wizardState: WizardState;
  closeWizard: () => void;
  getEventById: (id: string) => CalendarEvent | undefined;
}

interface WizardState {
  open: boolean;
  options?: WizardOptions;
}

const CalendarEventsContext = createContext<CalendarEventsContextValue | null>(
  null,
);

const sortEvents = (list: CalendarEvent[]) =>
  [...list].sort((a, b) => {
    const aDate = combineDateTime(a.date, a.time);
    const bDate = combineDateTime(b.date, b.time);
    return aDate.getTime() - bDate.getTime();
  });

const combineDateTime = (date: Date, time: string) => {
  const [hoursMinutes, suffix] = time.split(' ');
  const [hoursRaw, minutesRaw = '00'] = hoursMinutes.split(':');
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const normalizedHours =
    suffix?.toLowerCase() === 'pm' && hours < 12
      ? hours + 12
      : suffix?.toLowerCase() === 'am' && hours === 12
      ? 0
      : hours;
  const value = new Date(date);
  value.setHours(normalizedHours, minutes, 0, 0);
  return value;
};

export const CalendarEventsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // Load events from localStorage or use initial events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const stored = localStorage.getItem('connectsphere_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return sortEvents(parsed.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })));
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    }
    return sortEvents(initialCalendarEvents);
  });
  
  const [pinnedEventId, setPinnedEventId] = useState<string | null>(null);
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null);
  const [wizardState, setWizardState] = useState<WizardState>({ open: false });

  // Save events to localStorage whenever they change
  const saveToLocalStorage = (eventsList: CalendarEvent[]) => {
    try {
      localStorage.setItem('connectsphere_events', JSON.stringify(eventsList));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  };

  const addEvents = useCallback((newEvents: CalendarEvent[]) => {
    setEvents((prev) => {
      const updated = sortEvents([...prev, ...newEvents]);
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) => {
        const updated = sortEvents(
          prev.map((event) => (event.id === id ? { ...event, ...updates } : event)),
        );
        saveToLocalStorage(updated);
        return updated;
      });
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((event) => event.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const respondToInvitation = useCallback(
    (eventId: string, attendeeName: string, status: RSVPStatus) => {
      setEvents((prev) => {
        const updated = sortEvents(
          prev.map((event) => {
            if (event.id !== eventId) return event;
            const attendees: EventAttendee[] = event.attendees.some(
              (attendee) => attendee.name === attendeeName,
            )
              ? event.attendees.map((attendee) =>
                  attendee.name === attendeeName
                    ? { ...attendee, status }
                    : attendee,
                )
              : [
                  ...event.attendees,
                  { id: `att-${attendeeName.toLowerCase()}`, name: attendeeName, status },
                ];
            return { ...event, attendees };
          }),
        );
        saveToLocalStorage(updated);
        return updated;
      });
    },
    [],
  );

  const pinEventToChat = useCallback((eventId: string) => {
    setPinnedEventId(eventId);
  }, []);

  const clearPinnedEvent = useCallback(() => {
    setPinnedEventId(null);
  }, []);

  const openWizard = useCallback((options?: WizardOptions) => {
    setWizardState({ open: true, options });
  }, []);

  const closeWizard = useCallback(() => {
    setWizardState({ open: false });
  }, []);

  const getEventById = useCallback((id: string) => {
    return events.find((event) => event.id === id);
  }, [events]);

  const pinnedEvent = useMemo(
    () => events.find((event) => event.id === pinnedEventId),
    [events, pinnedEventId],
  );

  const value = useMemo<CalendarEventsContextValue>(
    () => ({
      events,
      addEvents,
      updateEvent,
      deleteEvent,
      respondToInvitation,
      pinEventToChat,
      clearPinnedEvent,
      pinnedEvent,
      highlightedDate,
      setHighlightedDate,
      openWizard,
      wizardState,
      closeWizard,
      getEventById,
    }),
    [
      events,
      addEvents,
      updateEvent,
      deleteEvent,
      respondToInvitation,
      pinEventToChat,
      clearPinnedEvent,
      pinnedEvent,
      highlightedDate,
      openWizard,
      wizardState,
      closeWizard,
      getEventById,
    ],
  );

  return (
    <CalendarEventsContext.Provider value={value}>
      {children}
    </CalendarEventsContext.Provider>
  );
};

export const useCalendarEvents = () => {
  const context = useContext(CalendarEventsContext);
  if (!context) {
    throw new Error('useCalendarEvents must be used within CalendarEventsProvider');
  }
  return context;
};

export const createEventFromInput = (
  input: NewEventInput,
  id: string,
  recurrenceId?: string,
): CalendarEvent => ({
  id,
  title: input.title,
  type: input.type,
  activity: input.title,
  date: input.date,
  time: input.time,
  location: input.location,
  attendees: input.attendees,
  maxParticipants: input.maxParticipants,
  isHost: true,
  status: 'upcoming',
  description: input.description,
  image:
    input.image ||
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
  tags: input.tags,
  recurrenceId,
});
