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

const CONVERSATION_LIST_KEY = 'conversationList';
const MESSAGE_STORAGE_KEY = 'messageStorage';

export const chatStorage = {
  // Get all conversations
  getConversations(): Conversation[] {
    const saved = localStorage.getItem(CONVERSATION_LIST_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  // Get messages for a specific event
  getMessages(eventId: string): Message[] {
    const storage = localStorage.getItem(MESSAGE_STORAGE_KEY);
    const messageStorage = storage ? JSON.parse(storage) : {};
    return messageStorage[eventId] || [];
  },

  // Update or add a conversation when a message is sent
  updateConversation(eventId: string, title: string, lastMessage: string, image?: string, activity?: string) {
    const conversations = this.getConversations();
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const existingIndex = conversations.findIndex(c => c.eventId === eventId);
    
    if (existingIndex >= 0) {
      conversations[existingIndex] = {
        ...conversations[existingIndex],
        lastMessage,
        time,
        unreadCount: 0,
      };
    } else {
      conversations.unshift({
        eventId,
        title,
        lastMessage,
        time,
        unreadCount: 0,
        image,
        activity,
      });
    }

    localStorage.setItem(CONVERSATION_LIST_KEY, JSON.stringify(conversations));
  },

  // Save messages for an event
  saveMessages(eventId: string, messages: Message[]) {
    const storage = localStorage.getItem(MESSAGE_STORAGE_KEY);
    const messageStorage = storage ? JSON.parse(storage) : {};
    messageStorage[eventId] = messages;
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messageStorage));
  },

  // Delete a conversation and its messages
  deleteConversation(eventId: string) {
    // Remove from conversation list
    const conversations = this.getConversations().filter(c => c.eventId !== eventId);
    localStorage.setItem(CONVERSATION_LIST_KEY, JSON.stringify(conversations));

    // Remove messages
    const storage = localStorage.getItem(MESSAGE_STORAGE_KEY);
    const messageStorage = storage ? JSON.parse(storage) : {};
    delete messageStorage[eventId];
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messageStorage));
  },
};
