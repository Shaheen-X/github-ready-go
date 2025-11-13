import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Trash2, Image as ImageIcon, FileText, MessageCircle, Bell, BellOff, UserPlus, Calendar, Search, Copy, Share2, Mail, MessageSquare, History, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useCalendarEventsDB } from '@/hooks/useCalendarEventsDB';
import { useCalls } from '@/hooks/useCalls';
import { CallModal } from '@/components/CallModal';
import { format } from 'date-fns';
import { useMessagesDB } from '@/hooks/useMessagesDB';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { EventDetailsModal, type CalendarEventDetails } from '@/components/EventDetailsModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ChatPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events } = useCalendarEventsDB();
  const { 
    useConversationMessages, 
    sendMessage, 
    deleteConversation, 
    toggleReaction,
    deleteMessage,
    togglePinMessage,
  } = useMessagesDB();
  const { data: messages = [] } = useConversationMessages(eventId || '');
  const {
    activeCall,
    callHistory,
    startCall,
    endCall,
    toggleMute,
    toggleVideo
  } = useCalls();
  const [newMessage, setNewMessage] = useState('');
  const [showSharedMedia, setShowSharedMedia] = useState(false);
  const [sharedMediaType, setSharedMediaType] = useState<'images' | 'files'>('images');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; sender: string } | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const callOptionsRef = useRef<HTMLDivElement>(null);

  const event = events.find(e => e.id === eventId);
  
  const inviteLink = event ? `https://connectsphere.app/event/${event.id}` : '';

  // Mock event participants for invite functionality
  // In a real app, this would come from the event data
  const eventParticipants = event ? [
    { id: '1', name: 'Sarah Kim', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Mike Chen', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '3', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
  ] : [];
  
  const filteredUsers = eventParticipants.filter((participant: any) =>
    participant.name.toLowerCase().includes(inviteSearchQuery.toLowerCase()) ||
    (participant.email && participant.email.toLowerCase().includes(inviteSearchQuery.toLowerCase()))
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle clicking outside call options to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (callOptionsRef.current && !callOptionsRef.current.contains(event.target as Node)) {
        setShowCallOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get call history for this event
  useEffect(() => {
    if (eventId) {
      console.log('🔍 Getting call history for event:', eventId);
      // Call history will be loaded automatically by the useCalls hook
    }
  }, [eventId]);

  // Debug: Log call history changes
  useEffect(() => {
    console.log('📞 Call history updated:', callHistory);
  }, [callHistory]);

  // Handle active call state
  useEffect(() => {
    if (activeCall) {
      console.log('📱 Active call detected:', activeCall);
      setActiveCallModal(true);
      setShowCallOptions(false);
    } else {
      setActiveCallModal(false);
    }
  }, [activeCall]);

  const handleStartCall = (type: 'audio' | 'video') => {
    if (!eventId || !event) return;
    
    console.log('🚀 Starting call:', { type, eventId, event: event.title });
    


    startCall(eventId, type, []);
    
    setShowCallOptions(false);
  };

  const handleEndCall = () => {
    console.log('🔚 Ending call');
    endCall();
    setActiveCallModal(false);
  };

  const handleToggleMute = () => {
    console.log('🔇 Toggle mute');
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    console.log('📹 Toggle video');
    toggleVideo();
    setIsVideoOn(!isVideoOn);
  };



  const formatCallDuration = (duration: number | Date, endTime?: Date) => {
    let durationSeconds: number;
    
    if (typeof duration === 'number') {
      // Duration in seconds
      durationSeconds = duration;
    } else {
      // Duration is startTime, calculate from startTime to endTime or now
      const start = new Date(duration);
      const end = endTime ? new Date(endTime) : new Date();
      durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    }
    
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCallTime = (time: Date | string) => {
    return format(new Date(time), 'h:mm a');
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && attachments.length === 0) || !eventId) return;

    let messageText = newMessage;
    if (attachments.length > 0) {
      const fileDescriptions = attachments.map(file => {
        return file.type.startsWith('image/') ? '📷 Image' : `📎 ${file.name}`;
      });
      messageText = messageText ? `${messageText}\n${fileDescriptions.join('\n')}` : fileDescriptions.join('\n');
    }

    sendMessage({ eventId, text: messageText, replyToId: replyingTo?.id });
    setNewMessage('');
    setReplyingTo(null);
    setAttachments([]);
  };

  const handleDeleteConversation = () => {
    if (!eventId) return;
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      deleteConversation(eventId);
      navigate('/messages');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    setAttachments(prev => [...prev, ...selectedFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    if (!eventId) return;
    toggleReaction({ messageId, reactionType, eventId });
    setShowReactionPicker(null);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard');
    setShowReactionPicker(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (eventId) {
      deleteMessage({ messageId, eventId });
      setShowReactionPicker(null);
    }
  };

  const handlePinMessage = (messageId: string, isPinned: boolean) => {
    if (eventId) {
      togglePinMessage({ messageId, eventId, isPinned });
      setShowReactionPicker(null);
    }
  };



  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invite link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy invite link:', error);
      toast.error('Failed to copy invite link');
    }
  };

  const quickReactions = ['👍', '❤️', '😂', '😮', '🤝', '🙏', '🔥', '🎉', '💯', '👏'];

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { date: string; messages: any[] }[], message) => {
    const messageDate = format(new Date(message.timestamp || message.time), 'EEEE, MMM d');
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.date === messageDate) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ date: messageDate, messages: [message] });
    }
    
    return groups;
  }, []);

  const formatMessageTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    return format(new Date(timestamp), 'h:mm a');
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/messages')}
              className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={event.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                alt={event.title}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/50 shadow-sm"
              />
            </div>
            <div 
              className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowEventDetails(true)}
            >
              <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {format(new Date(event.date), 'EEEE, MMM d')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {event.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            <DropdownMenu open={showCallOptions} onOpenChange={setShowCallOptions}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all"
                >
                  <Phone size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuItem onClick={() => handleStartCall('audio')}>
                  <Phone size={14} className="mr-2" />
                  Audio Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStartCall('video')}>
                  <Video size={14} className="mr-2" />
                  Video Call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <DropdownMenuItem 
                  onSelect={() => {
                    // Let dropdown close naturally, then open modal
                    setTimeout(() => setShowEventDetailsModal(true), 100);
                  }}
                >
                  <Calendar size={14} className="mr-2" />
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
                <DropdownMenuItem onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? (
                    <>
                      <BellOff size={14} className="mr-2" />
                      Unmute Notifications
                    </>
                  ) : (
                    <>
                      <Bell size={14} className="mr-2" />
                      Mute Notifications
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCallHistory(true)}>
                  <History size={14} className="mr-2" />
                  Call History
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

      {/* Event Details Sheet */}
      <Sheet open={showEventDetails} onOpenChange={setShowEventDetails}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold gradient-text">{event.title}</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Event Info */}
            <div className="glass-card p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="text-blue-600" size={18} />
                <div>
                  <p className="font-medium text-foreground">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <svg className="text-blue-600 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p className="text-foreground">{event.location}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => handleStartCall('audio')}
                className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Phone className="text-blue-600" size={20} />
                </div>
                <span className="text-xs font-medium text-foreground">Audio</span>
              </button>
              <button 
                onClick={() => handleStartCall('video')}
                className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Video className="text-blue-600" size={20} />
                </div>
                <span className="text-xs font-medium text-foreground">Video</span>
              </button>
              <button 
                onClick={() => setShowInviteSheet(true)}
                className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <UserPlus className="text-blue-600" size={20} />
                </div>
                <span className="text-xs font-medium text-foreground">Add</span>
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMuted 
                    ? 'bg-gradient-to-br from-red-100 to-orange-100' 
                    : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                }`}>
                  {isMuted ? (
                    <BellOff className="text-red-600" size={20} />
                  ) : (
                    <Bell className="text-blue-600" size={20} />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {isMuted ? 'Unmute' : 'Mute'}
                </span>
              </button>
            </div>

            {/* Members */}
            <div className="glass-card p-4 rounded-2xl">
              <h4 className="font-semibold text-foreground mb-3">Members ({event.attendees.length})</h4>
              <div className="space-y-2">
                {event.attendees.slice(0, 5).map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{attendee.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{attendee.status}</p>
                    </div>
                  </div>
                ))}
                {event.attendees.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{event.attendees.length - 5} more
                  </p>
                )}
              </div>
            </div>

            {/* Event Details Button */}
            <Button 
              onClick={() => {
                setShowEventDetails(false);
                // Wait for Sheet to close before opening Dialog
                setTimeout(() => setShowEventDetailsModal(true), 300);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 rounded-2xl h-12"
            >
              View Full Event Details
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Event Details Modal */}
      {event && showEventDetailsModal && (
        <EventDetailsModal
          key={`event-modal-${event.id}`}
          open={showEventDetailsModal}
          onOpenChange={(open) => {
            setShowEventDetailsModal(open);
          }}
          event={{
            ...event,
            date: format(new Date(event.date), 'EEEE, MMMM d, yyyy')
          } as CalendarEventDetails}
        />
      )}

      {/* Invite Sheet */}
      <Sheet open={showInviteSheet} onOpenChange={setShowInviteSheet}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold gradient-text">Invite to Chat</SheetTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Invite event participants to join this chat conversation
            </p>
          </SheetHeader>

          <Tabs defaultValue="participants" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="participants">Event Participants</TabsTrigger>
              <TabsTrigger value="outside">Share Link</TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-4 mt-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search event participants..."
                  value={inviteSearchQuery}
                  onChange={(e) => setInviteSearchQuery(e.target.value)}
                  className="glass-card border-white/20 rounded-xl h-12 pl-10"
                />
              </div>

              {/* Event Participants List */}
              <ScrollArea className="h-[400px] rounded-xl">
                <div className="space-y-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No event participants found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {inviteSearchQuery ? 'Try a different search term' : 'All event participants are already in this chat'}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((participant: any) => (
                      <div
                        key={participant.id}
                        className="glass-card p-4 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={participant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                            alt={participant.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {participant.email || `Event participant`}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            // Handle invite to chat functionality
                            toast.success(`Invited ${participant.name} to join the chat`);
                            setShowInviteSheet(false);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full"
                        >
                          Invite to Chat
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="outside" className="space-y-4 mt-4">
              {/* Copy Link */}
              <div className="glass-card p-4 rounded-2xl space-y-3">
                <h4 className="font-semibold text-foreground">Share Link</h4>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="glass-card border-white/20 rounded-xl flex-1"
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                  >
                    {copied ? 'Copied!' : <Copy size={18} />}
                  </Button>
                </div>
              </div>

              {/* Share via Platforms */}
              <div className="glass-card p-4 rounded-2xl space-y-3">
                <h4 className="font-semibold text-foreground">Share via</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const text = `Join us for ${event?.title}! ${inviteLink}`;
                      window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <MessageSquare className="text-green-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-foreground">SMS</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `Join us for ${event?.title}! ${inviteLink}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <MessageCircle className="text-green-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-foreground">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `Join us for ${event?.title}!`;
                      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(inviteLink)}`, '_blank');
                    }}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-foreground">Email</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `Join us for ${event?.title}! ${inviteLink}`;
                      window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Send className="text-blue-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-foreground">Telegram</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: event?.title || 'Join us',
                            text: `Join us for ${event?.title}!`,
                            url: inviteLink,
                          });
                        } catch (error) {
                          console.error('Error sharing:', error);
                        }
                      }
                    }}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Share2 className="text-purple-600" size={20} />
                    </div>
                    <span className="text-xs font-medium text-foreground">More</span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

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
          groupedMessages.map((group) => (
            <div key={group.date} className="space-y-4">
              {/* Date Header */}
              {group.date && (
                <div className="flex justify-center">
                  <div className="glass-card px-3 py-1 rounded-full">
                    <p className="text-xs font-medium text-muted-foreground">
                      {group.date}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Messages for this date */}
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!message.isOwn && message.avatar && (
                      <ImageWithFallback
                        src={message.avatar}
                        alt={message.sender}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white/50 flex-shrink-0"
                      />
                    )}
                    
                    <div className="relative flex flex-col gap-1">
                      <div 
                        className={`rounded-2xl px-4 py-2.5 shadow-sm select-none break-words inline-block max-w-full ${
                          message.isOwn 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                            : 'glass-card'
                        }`}
                        onTouchStart={() => {
                          const timer = setTimeout(() => {
                            setShowReactionPicker(showReactionPicker === message.id ? null : message.id);
                          }, 500);
                          
                          const cleanup = () => {
                            clearTimeout(timer);
                            document.removeEventListener('touchend', cleanup);
                            document.removeEventListener('touchmove', cleanup);
                          };
                          
                          document.addEventListener('touchend', cleanup);
                          document.addEventListener('touchmove', cleanup);
                        }}
                        onMouseDown={() => {
                          const timer = setTimeout(() => {
                            setShowReactionPicker(showReactionPicker === message.id ? null : message.id);
                          }, 500);
                          
                          const cleanup = () => {
                            clearTimeout(timer);
                            document.removeEventListener('mouseup', cleanup);
                            document.removeEventListener('mouseleave', cleanup);
                          };
                          
                          document.addEventListener('mouseup', cleanup);
                          document.addEventListener('mouseleave', cleanup);
                        }}
                      >
                        {/* Reply Preview */}
                        {message.replyTo && (
                          <div className={`mb-2 pb-2 border-b ${
                            message.isOwn ? 'border-blue-300/30' : 'border-border/30'
                          }`}>
                            <p className={`text-xs font-medium mb-1 ${
                              message.isOwn ? 'text-blue-100' : 'text-muted-foreground'
                            }`}>
                              Replying to
                            </p>
                            <p className={`text-xs line-clamp-2 ${
                              message.isOwn ? 'text-blue-50' : 'text-foreground/70'
                            }`}>
                              {message.replyTo.text}
                            </p>
                          </div>
                        )}

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mb-2 space-y-2">
                            {message.attachments.map((att: any, idx: number) => (
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
                        <div className={`flex items-center justify-between gap-2 mt-1 ${
                          message.isOwn ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          <p className="text-xs">
                            {formatMessageTime(message.timestamp)}
                          </p>
                          {message.isOwn && message.status && (
                            <div className="flex items-center gap-0.5">
                              {message.status === 'sent' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                              {message.status === 'delivered' && (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </>
                              )}
                              {message.status === 'read' && (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reactions Display */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          {message.reactions.map((reaction: any) => (
                            <button
                              key={reaction.type}
                              onClick={() => handleReaction(message.id, reaction.type)}
                              className={`glass-card px-2 py-0.5 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform ${
                                reaction.hasReacted ? 'ring-2 ring-blue-500' : ''
                              }`}
                            >
                              <span>{reaction.type}</span>
                              <span className="font-medium">{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Reaction Picker */}
                      {showReactionPicker === message.id && (
                        <div 
                          className={`absolute top-full mt-2 z-50 glass-card p-3 rounded-2xl shadow-lg reaction-picker ${
                            message.isOwn ? 'right-0' : 'left-0'
                          }`}
                        >
                          <div className="flex flex-col gap-3">
                            {/* Reactions Row */}
                            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide items-center">
                              {quickReactions.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-10 h-10 flex-shrink-0 rounded-full hover:bg-white/50 transition-all flex items-center justify-center text-xl hover:scale-125"
                                >
                                  {emoji}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  const emoji = prompt('Enter emoji:');
                                  if (emoji) handleReaction(message.id, emoji);
                                }}
                                className="w-10 h-10 flex-shrink-0 rounded-full hover:bg-white/50 transition-all flex items-center justify-center text-xl hover:scale-125 text-muted-foreground font-bold"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Action Icons Row */}
                            <div className="flex gap-2 pt-2 border-t border-white/20">
                              <button
                                onClick={() => {
                                  setReplyingTo({ id: message.id, text: message.text, sender: message.sender });
                                  setShowReactionPicker(null);
                                }}
                                className="p-2 rounded-xl hover:bg-white/50 transition-all text-muted-foreground hover:text-foreground"
                                title="Reply"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="9 17 4 12 9 7"></polyline>
                                  <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleCopyMessage(message.text)}
                                className="p-2 rounded-xl hover:bg-white/50 transition-all text-muted-foreground hover:text-foreground"
                                title="Copy"
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                onClick={() => handlePinMessage(message.id, message.isPinned || false)}
                                className="p-2 rounded-xl hover:bg-white/50 transition-all text-muted-foreground hover:text-foreground"
                                title={message.isPinned ? 'Unpin' : 'Pin'}
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="17" x2="12" y2="22"></line>
                                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                </svg>
                              </button>
                              {message.isOwn && (
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="p-2 rounded-xl hover:bg-white/50 transition-all text-destructive hover:text-destructive/80"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="glass-card border-t border-white/20 p-4 sticky bottom-0">
        {/* Reply Preview */}
        {replyingTo && (
          <div className="px-4 py-3 border-t bg-blue-50/50 mb-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Replying to {replyingTo.sender}</p>
                <p className="text-sm text-foreground/70 line-clamp-2">{replyingTo.text}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-muted-foreground hover:text-foreground ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* File Attachments */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/50 mb-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="glass-card p-2 rounded-lg flex items-center gap-2">
                  <FileText size={16} />
                  <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* File Attachment Button */}
          <label className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="sr-only"
            />
            <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Paperclip size={20} className="text-muted-foreground" />
            </div>
          </label>

          {/* Message Input Container */}
          <div className="flex-1 glass-card rounded-2xl overflow-hidden">
            <textarea
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-transparent border-0 resize-none outline-none placeholder:text-muted-foreground text-sm max-h-32 min-h-[2.75rem]"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && attachments.length === 0}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim() || attachments.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-110 shadow-lg' 
                : 'glass-card text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Event Details Modal */}
      {event && showEventDetailsModal && (
        <EventDetailsModal
          event={{...event, date: event.date.toISOString()} as CalendarEventDetails}
          open={showEventDetailsModal}
          onOpenChange={(open) => {
            setShowEventDetailsModal(open);
          }}
        />
      )}

      {/* Call Modal */}
      {activeCall && (
        <CallModal
          activeCall={activeCall}
          isOpen={activeCallModal}
          onClose={handleEndCall}
          onEndCall={handleEndCall}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          localVideoRef={React.createRef()}
          remoteVideoRef={React.createRef()}
          formatCallDuration={formatCallDuration}
          getCallStatusText={() => 'Connected'}
        />
      )}

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
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No shared images yet</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No shared files yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call History Modal */}
      {showCallHistory && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setShowCallHistory(false)}
        >
          <div 
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Call History
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowCallHistory(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-white/50"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <p>Current eventId: {eventId}</p>
                <p>Total calls in history: {callHistory.length}</p>
                <p>Filtered calls: {callHistory.filter(call => call.eventId === eventId).length}</p>
                {callHistory.length > 0 && (
                  <p>Call eventIds: {callHistory.map(c => c.eventId).join(', ')}</p>
                )}
              </div>
              
              {callHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No calls yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Make your first call to see it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {callHistory
                    .map((call) => (
                    <div
                      key={call.id}
                      className="glass-card p-4 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          {call.type === 'video' ? (
                            <Video className="text-blue-600" size={18} />
                          ) : (
                            <Phone className="text-blue-600" size={18} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {call.type === 'video' ? 'Video Call' : 'Audio Call'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCallTime(call.startTime)}
                            {call.duration && (
                              <> • {formatCallDuration(call.duration)}</>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">EventId: {call.eventId} | Status: {call.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowCallHistory(false);
                            handleStartCall('audio');
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Audio call"
                        >
                          <Phone size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowCallHistory(false);
                            handleStartCall('video');
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Video call"
                        >
                          <Video size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

