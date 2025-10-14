import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Trash2, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useCalendarEvents } from '@/context/calendar-events-context';
import { format } from 'date-fns';
import { useChat } from '@/context/ChatContext';
import { type Message } from '@/types/chat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ChatPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventById } = useCalendarEvents();
  const { conversations, getMessages, sendMessage, deleteConversation } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSharedMedia, setShowSharedMedia] = useState(false);
  const [sharedMediaType, setSharedMediaType] = useState<'images' | 'files'>('images');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const event = eventId ? getEventById(eventId) : null;

  useEffect(() => {
    if (eventId) {
      setMessages(getMessages(eventId));
    }
  }, [eventId, getMessages]);

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

    // Update local state
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Update context (which auto-saves to localStorage)
    sendMessage(eventId, message, event.title, event.image, event.activity);
    
    setNewMessage('');
  };

  const handleDeleteConversation = () => {
    if (!eventId) return;
    deleteConversation(eventId);
    navigate('/messages');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For demo purposes, create mock URLs (in production, upload to server/storage)
    const file = files[0];
    const mockUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: isImage ? '📷 Image' : `📎 ${file.name}`,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      attachments: [{
        type: isImage ? 'image' : 'file',
        url: mockUrl,
        name: file.name
      }]
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    if (eventId && event) {
      sendMessage(eventId, message, event.title, event.image, event.activity);
    }
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
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => navigate(`/calendar`)}>
                  View Event Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSharedMediaType('images');
                  setShowSharedMedia(true);
                }}>
                  <ImageIcon size={14} className="mr-2" />
                  Shared Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSharedMediaType('files');
                  setShowSharedMedia(true);
                }}>
                  <FileText size={14} className="mr-2" />
                  Shared Files
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
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {message.attachments.map((att, idx) => (
                        <div key={idx}>
                          {att.type === 'image' ? (
                            <img src={att.url} alt="" className="max-h-48 rounded-lg" />
                          ) : (
                            <a 
                              href={att.url} 
                              download={att.name}
                              className={`flex items-center gap-2 underline ${message.isOwn ? 'text-blue-100' : 'text-blue-600'}`}
                            >
                              <FileText size={16} />
                              {att.name || 'File'}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
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

      {/* Shared Media Modal */}
      {showSharedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSharedMedia(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {sharedMediaType === 'images' ? 'Shared Images' : 'Shared Files'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSharedMedia(false)}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              {sharedMediaType === 'images' ? (
                conversations.find(c => c.eventId === eventId)?.sharedImages.length ? (
                  <div className="grid grid-cols-3 gap-2">
                    {conversations.find(c => c.eventId === eventId)?.sharedImages.map((url, idx) => (
                      <img key={idx} src={url} alt="" className="w-full h-32 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No shared images yet</p>
                )
              ) : (
                conversations.find(c => c.eventId === eventId)?.sharedFiles.length ? (
                  <div className="space-y-2">
                    {conversations.find(c => c.eventId === eventId)?.sharedFiles.map((url, idx) => (
                      <a 
                        key={idx}
                        href={url} 
                        download
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <FileText size={20} />
                        File {idx + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No shared files yet</p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
