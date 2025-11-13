export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name?: string;
}

export interface MessageReaction {
  type: string;
  count: number;
  hasReacted: boolean;
}

export interface ReplyTo {
  id: string;
  text: string;
  sender: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  timestamp?: string;
  isOwn: boolean;
  avatar?: string;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  replyTo?: ReplyTo;
  status?: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
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
