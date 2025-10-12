import { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Sarah Martinez',
    lastMessage: 'Great workout today! Same time tomorrow?',
    time: '2m ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face',
    online: true,
    activity: 'Yoga Session'
  },
  {
    id: 2,
    name: 'Basketball Squad',
    lastMessage: 'Mike: Who\'s bringing the ball?',
    time: '15m ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop',
    isGroup: true,
    members: 6,
    activity: 'Basketball Game'
  },
  {
    id: 3,
    name: 'Emma Chen',
    lastMessage: 'Thanks for the tennis tips! 🎾',
    time: '1h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    online: false,
    activity: 'Tennis Match'
  },
  {
    id: 4,
    name: 'Running Club',
    lastMessage: 'Meeting at the park entrance',
    time: '3h ago',
    unread: 1,
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    isGroup: true,
    members: 12,
    activity: 'Morning Run'
  }
];

const currentMessages = [
  {
    id: 1,
    sender: 'Sarah Martinez',
    message: 'Hey! How did the yoga session go today?',
    time: '10:30 AM',
    isOwn: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    sender: 'You',
    message: 'It was amazing! I feel so much more flexible already. Thanks for recommending that instructor.',
    time: '10:32 AM',
    isOwn: true
  },
  {
    id: 3,
    sender: 'Sarah Martinez',
    message: 'I\'m so glad you enjoyed it! Want to join me for tomorrow\'s session too?',
    time: '10:35 AM',
    isOwn: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 4,
    sender: 'You',
    message: 'Absolutely! Same time and place?',
    time: '10:36 AM',
    isOwn: true
  },
  {
    id: 5,
    sender: 'Sarah Martinez',
    message: 'Great workout today! Same time tomorrow?',
    time: '11:45 AM',
    isOwn: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face'
  }
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const renderConversationList = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <ImageWithFallback
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.isGroup && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.members}
                  </div>
                )}
                {!conversation.isGroup && conversation.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center p-0">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                
                {conversation.activity && (
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {conversation.activity}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Message Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12">
          <Plus className="mr-2 w-4 h-4" />
          New Message
        </Button>
      </div>
    </div>
  );

  const renderConversationView = () => {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="p-1 text-gray-600"
              >
                ←
              </Button>
              <div className="relative">
                <ImageWithFallback
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {!conversation.isGroup && conversation.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{conversation.name}</h3>
                <p className="text-xs text-gray-500">
                  {conversation.isGroup 
                    ? `${conversation.members} members` 
                    : conversation.online ? 'Online now' : 'Last seen 2h ago'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-xs ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isOwn && (
                  <ImageWithFallback
                    src={message.avatar}
                    alt={message.sender}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                
                <div className={`rounded-2xl px-4 py-2 ${
                  message.isOwn 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                    : 'bg-white text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Plus size={18} />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-10 bg-gray-50 border-gray-200 rounded-xl"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Smile size={16} />
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl w-10 h-10 p-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50">
      {selectedConversation ? renderConversationView() : renderConversationList()}
    </div>
  );
}