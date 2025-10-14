export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name?: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  avatar?: string;
  attachments?: Attachment[];
}

export interface Conversation {
  eventId: string;
  title: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  image?: string;
  activity?: string;
  sharedImages: string[];
  sharedFiles: string[];
}
