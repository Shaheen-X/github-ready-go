export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  avatar?: string;
}

export interface Conversation {
  eventId: string;
  title: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  image?: string;
  activity?: string;
}
