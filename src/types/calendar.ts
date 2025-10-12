export type EventType = 'one-to-one' | 'group';

export type RSVPStatus = 'accepted' | 'declined' | 'pending';

export interface Attendee {
  id: string;
  name: string;
  status: RSVPStatus;
}

export interface EventAttendee {
  id: string;
  name: string;
  status: RSVPStatus;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  activity: string;
  date: Date;
  time: string;
  endTime?: string;
  location: string;
  description: string;
  attendees: EventAttendee[];
  maxParticipants: number | null; // null means unlimited
  status: 'upcoming' | 'completed' | 'cancelled';
  tags: string[];
  image?: string;
  isHost?: boolean;
  isPrivate?: boolean;
  hostName?: string;
  hostId?: string;
  isRepeating?: boolean;
  repeatFrequency?: 'daily' | 'weekly' | 'monthly' | null;
  recurrenceId?: string;
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  type: EventType;
  emoji: string;
  defaultTime: string;
  defaultLocation: string;
  defaultMaxParticipants?: number;
  tags: string[];
  bannerImage?: string;
}

export interface NewEventInput {
  title: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  description: string;
  attendees: EventAttendee[];
  maxParticipants: number;
  tags: string[];
  image?: string;
}

export interface RecurrenceConfig {
  enabled: boolean;
  daysOfWeek: number[];
  occurrences: number;
}

export interface ConnectedUser {
  id: string;
  name: string;
  subtitle?: string;
  isRecentMatch: boolean;
}