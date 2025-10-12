import type { CalendarEvent } from '@/types/calendar';

export const sampleCalendarEvents: CalendarEvent[] = [];

export interface UserConnection {
  id: string;
  name: string;
  avatar: string;
  status?: string;
}

export const userConnections: UserConnection[] = [];
