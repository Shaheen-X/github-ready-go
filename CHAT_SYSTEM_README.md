# Chat System Documentation

## Overview
The app now has a fully functional WhatsApp-style chat system where you can message other event participants.

## How to Test the Chat System

### 1. View Conversations
- Navigate to the Messages tab in bottom navigation
- You'll see 3 demo conversations with event chats:
  - Morning Run with Sarah (Running event)
  - Basketball Pickup Game (Basketball event)
  - Weekend Yoga Session (Yoga event)

### 2. Open a Chat
- Click on any conversation to open the chat window
- You'll see existing demo messages from other participants

### 3. Send Messages
- Type your message in the input field at the bottom
- Press Enter or click the send button
- Your messages appear on the right side with a blue gradient background
- Other people's messages appear on the left with a white background

### 4. Send Attachments (Images/Files)
- Click the paperclip icon to attach files or images
- Files and images are previewed in the chat
- All attachments are tracked and can be viewed later

### 5. View Shared Media
- Click the three dots menu (⋮) in the chat header
- Select "Shared Images" to see all images shared in this chat
- Select "Shared Files" to see all files shared in this chat

### 6. Delete a Conversation
- Click the three dots menu (⋮) in the chat header
- Select "Delete Conversation"
- The entire conversation and all messages will be removed

## Features

### ✅ Working Features
- Send text messages
- Real-time message display
- Message persistence (stored in localStorage)
- Conversation list with last message preview
- Unread message counts
- Event-based chat rooms (each event has its own chat)
- File and image attachments
- Shared media viewer
- Delete conversations
- Responsive design
- Smooth scrolling to latest messages

### Data Persistence
All chat data is stored in browser localStorage:
- **conversationList**: Stores all conversations with metadata
- **messageStorage**: Stores all messages for each event

### Demo Data
The app includes 3 pre-loaded conversations with messages to help you test:
1. **event-1** (Morning Run): 3 messages
2. **event-2** (Basketball): 3 messages  
3. **event-3** (Yoga): 3 messages

## Technical Details

### File Structure
```
src/
├── types/
│   └── chat.ts                    # TypeScript interfaces
├── context/
│   └── ChatContext.tsx            # State management
├── pages/
│   ├── MessagesPage.tsx           # Conversation list
│   └── ChatPage.tsx               # Individual chat window
└── utils/
    └── demoChat.ts                # Demo data initialization
```

### How It Works
1. Chat data is managed by `ChatContext` using React Context API
2. Messages are stored per event ID
3. When you send a message, it updates both the message storage and conversation list
4. All data auto-saves to localStorage
5. Demo data is loaded on first app launch

## Routes
- `/messages` - View all conversations
- `/chat/:eventId` - Chat for specific event

## Future Enhancements
- Real-time sync with backend
- Push notifications
- Online/offline status
- Typing indicators
- Message reactions
- Reply to specific messages
- Group chat features
- Voice messages
