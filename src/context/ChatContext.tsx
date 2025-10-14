import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Message, Conversation } from '@/types/chat';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  getMessages: (eventId: string) => Message[];
  selectConversation: (id: string) => void;
  sendMessage: (eventId: string, message: Message, eventTitle: string, eventImage?: string, eventActivity?: string) => void;
  deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('conversationList');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [messageStorage, setMessageStorage] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('messageStorage');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('conversationList', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('messageStorage', JSON.stringify(messageStorage));
  }, [messageStorage]);

  const getMessages = (eventId: string): Message[] => {
    return messageStorage[eventId] || [];
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const sendMessage = (
    eventId: string, 
    message: Message, 
    eventTitle: string, 
    eventImage?: string, 
    eventActivity?: string
  ) => {
    // Update messages
    setMessageStorage(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), message]
    }));

    // Update or create conversation
    setConversations(prev => {
      const existing = prev.find(c => c.eventId === eventId);
      if (existing) {
        return prev.map(c =>
          c.eventId === eventId
            ? { ...c, lastMessage: message.text, time: message.time, unreadCount: 0 }
            : c
        );
      } else {
        return [...prev, {
          eventId,
          title: eventTitle,
          lastMessage: message.text,
          time: message.time,
          unreadCount: 0,
          image: eventImage,
          activity: eventActivity
        }];
      }
    });
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.eventId !== id));
    setMessageStorage(prev => {
      const newStorage = { ...prev };
      delete newStorage[id];
      return newStorage;
    });
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{ 
        conversations, 
        activeConversationId, 
        getMessages,
        selectConversation, 
        sendMessage, 
        deleteConversation 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
