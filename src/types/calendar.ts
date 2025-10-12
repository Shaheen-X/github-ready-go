export interface EventAttendee {
  id: string;
  name: string;
  status: 'accepted' | 'pending' | 'declined';
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  type: 'group' | 'pairing' | 'activity' | 'one-to-one';
  activity: string;
  location?: string;
  description?: string;
  attendees: EventAttendee[];
  maxParticipants?: number;
  status?: 'upcoming' | 'completed' | 'cancelled';
  tags?: string[];
  image?: string;
  isHost?: boolean;
  isPrivate?: boolean;
  hostName?: string;
  isRepeating?: boolean;
  repeatFrequency?: string;
}
