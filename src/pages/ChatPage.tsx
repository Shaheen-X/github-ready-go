import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useCalendarEvents } from '@/context/calendar-events-context';
import { format } from 'date-fns';
import { chatStorage, type Message } from '@/utils/chatStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export function ChatPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventById } = useCalendarEvents();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const event = eventId ? getEventById(eventId) : null;

  useEffect(() => {
    if (eventId) {
      setMessages(chatStorage.getMessages(eventId));
    }
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !eventId || !event) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Save to localStorage
    chatStorage.saveMessages(eventId, updatedMessages);
    chatStorage.updateConversation(eventId, event.title, newMessage, event.image, event.activity);
    
    setNewMessage('');
  };

  const handleDeleteConversation = () => {
    if (!eventId) return;
    chatStorage.deleteConversation(eventId);
    navigate('/messages');
  };

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/messages')}
              className="p-1 text-gray-600"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="relative">
              <ImageWithFallback
                src={event.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                alt={event.title}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <p className="text-xs text-gray-500">
                {format(new Date(event.date), 'MMM d, yyyy')} • {event.location}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/calendar`)}>
                  View Event Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteConversation} className="text-red-600">
                  <Trash2 size={14} className="mr-2" />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-xs ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isOwn && message.avatar && (
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
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
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
}
