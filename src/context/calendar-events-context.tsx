import { createContext, useContext, useState, ReactNode } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
}

interface CalendarEventsContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
}

const CalendarEventsContext = createContext<CalendarEventsContextType | undefined>(undefined);

export const CalendarEventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <CalendarEventsContext.Provider value={{ events, addEvent, removeEvent }}>
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
