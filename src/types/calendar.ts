export interface EventAttendee {
  id: string;
  name: string;
  status: 'accepted' | 'pending' | 'declined';
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  time: string;
  type: 'group' | 'pairing' | 'activity';
  location?: string;
  description?: string;
  attendees: EventAttendee[];
  maxParticipants?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  tags?: string[];
  image?: string;
  isHost?: boolean;
}
