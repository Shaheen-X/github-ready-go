import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Trash2, Image as ImageIcon, FileText, MessageCircle } from 'lucide-react';
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
  const [newMessage, setNewMessage] = useState('');
  const [showSharedMedia, setShowSharedMedia] = useState(false);
  const [sharedMediaType, setSharedMediaType] = useState<'images' | 'files'>('images');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const event = eventId ? getEventById(eventId) : null;
  
  // Get messages directly from context - this makes it reactive
  const messages = eventId ? getMessages(eventId) : [];

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

    // Update context (which auto-saves to localStorage and triggers re-render)
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Header */}
      <div className="glass-card border-b border-white/20 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/messages')}
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="relative">
              <ImageWithFallback
                src={event.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                alt={event.title}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/50 shadow-sm"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{event.title}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.date), 'MMM d, yyyy')} • {event.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
            >
              <Phone size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
            >
              <Video size={18} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
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
                <DropdownMenuItem onClick={handleDeleteConversation} className="text-destructive">
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
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="text-blue-600" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Start the conversation</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Send a message to connect with other participants
            </p>
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
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white/50"
                  />
                )}
                
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                  message.isOwn 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                    : 'glass-card'
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
                    message.isOwn ? 'text-blue-100' : 'text-muted-foreground'
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
      <div className="glass-card border-t border-white/20 p-4 sticky bottom-0">
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
            className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
              className="pr-10 bg-white/80 border-white/40 rounded-2xl focus:bg-white transition-all"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile size={18} />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 rounded-2xl w-11 h-11 p-0 flex-shrink-0 btn-scale disabled:opacity-50"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>

      {/* Shared Media Modal */}
      {showSharedMedia && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setShowSharedMedia(false)}
        >
          <div 
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {sharedMediaType === 'images' ? 'Shared Images' : 'Shared Files'}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSharedMedia(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-white/50"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              {sharedMediaType === 'images' ? (
                conversations.find(c => c.eventId === eventId)?.sharedImages.length ? (
                  <div className="grid grid-cols-3 gap-3">
                    {conversations.find(c => c.eventId === eventId)?.sharedImages.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="" 
                        className="w-full h-32 object-cover rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No shared images yet</p>
                  </div>
                )
              ) : (
                conversations.find(c => c.eventId === eventId)?.sharedFiles.length ? (
                  <div className="space-y-2">
                    {conversations.find(c => c.eventId === eventId)?.sharedFiles.map((url, idx) => (
                      <a 
                        key={idx}
                        href={url} 
                        download
                        className="flex items-center gap-3 p-4 glass-card hover:scale-[1.02] transition-all"
                      >
                        <FileText size={24} className="text-blue-600" />
                        <span className="text-foreground">File {idx + 1}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No shared files yet</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
