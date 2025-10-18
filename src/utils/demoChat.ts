import { Message } from '@/types/chat';

// Demo messages for testing the chat system
export const demoMessages: Record<string, Message[]> = {
  'event-1': [
    {
      id: 'msg-1-1',
      sender: 'Sarah Kim',
      text: 'Hey! Looking forward to our run tomorrow morning!',
      time: '9:30 AM',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop'
    },
    {
      id: 'msg-1-2',
      sender: 'You',
      text: 'Me too! Should we meet 5 minutes early?',
      time: '9:35 AM',
      isOwn: true
    },
    {
      id: 'msg-1-3',
      sender: 'Sarah Kim',
      text: 'Perfect! See you at 6:55 AM at the main entrance',
      time: '9:37 AM',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop'
    }
  ],
  'event-2': [
    {
      id: 'msg-2-1',
      sender: 'Mike Chen',
      text: 'Who is bringing the ball?',
      time: 'Yesterday',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: 'msg-2-2',
      sender: 'Alex Johnson',
      text: 'I got it! Also bringing extra water bottles',
      time: 'Yesterday',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
      id: 'msg-2-3',
      sender: 'You',
      text: 'Awesome! I will bring some snacks',
      time: 'Yesterday',
      isOwn: true
    }
  ],
  'event-3': [
    {
      id: 'msg-3-1',
      sender: 'Emma Wilson',
      text: 'Do not forget to bring your yoga mat!',
      time: '2:15 PM',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      id: 'msg-3-2',
      sender: 'You',
      text: 'Got it! What about towels?',
      time: '2:18 PM',
      isOwn: true
    },
    {
      id: 'msg-3-3',
      sender: 'Jennifer Lee',
      text: 'Good idea! I will bring extras just in case',
      time: '2:20 PM',
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop'
    }
  ]
};

// Initialize demo chat data in localStorage if not exists
export function initializeDemoChat() {
  const existingConversations = localStorage.getItem('conversationList');
  const existingMessages = localStorage.getItem('messageStorage');

  // Only initialize if no data exists
  if (!existingConversations || !existingMessages) {
    const conversations = [
      {
        eventId: 'event-1',
        title: 'Morning Run with Sarah',
        lastMessage: 'Perfect! See you at 6:55 AM at the main entrance',
        time: '9:37 AM',
        unreadCount: 0,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        activity: 'Running',
        sharedImages: [],
        sharedFiles: []
      },
      {
        eventId: 'event-2',
        title: 'Basketball Pickup Game',
        lastMessage: 'Awesome! I will bring some snacks',
        time: 'Yesterday',
        unreadCount: 2,
        image: 'https://images.unsplash.com/photo-1546519638-68e109acd27d?w=800&h=600&fit=crop',
        activity: 'Basketball',
        sharedImages: [],
        sharedFiles: []
      },
      {
        eventId: 'event-3',
        title: 'Weekend Yoga Session',
        lastMessage: 'Good idea! I will bring extras just in case',
        time: '2:20 PM',
        unreadCount: 1,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
        activity: 'Yoga',
        sharedImages: [],
        sharedFiles: []
      }
    ];

    localStorage.setItem('conversationList', JSON.stringify(conversations));
    localStorage.setItem('messageStorage', JSON.stringify(demoMessages));
  }
}
