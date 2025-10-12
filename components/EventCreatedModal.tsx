import React, { useState } from 'react';
import { X, Share2, UserPlus, Copy, Check, Users, MessageCircle, MoreHorizontal, Edit, Calendar, Volume2, Search, Globe, Lock, User, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface EventCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  eventData?: {
    eventName: string;
    activity: string;
    date: string;
    time: string;
    location?: string;
    selectedImage: string;
    isPrivate?: boolean;
    creator?: string;
  };
}

interface Buddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isSelected: boolean;
}

const mockBuddies: Buddy[] = [
  {
    id: '1',
    name: 'Emma Lindqvist',
    username: '@emmalind',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '2',
    name: 'Erik Andersson',
    username: '@erikand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '3',
    name: 'Astrid Johansson',
    username: '@astridj',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '4',
    name: 'Magnus Svensson',
    username: '@magnus',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '5',
    name: 'Lila Karlsson',
    username: '@lilak',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '6',
    name: 'Oscar Nilsson',
    username: '@oscar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  }
];

export const EventCreatedModal: React.FC<EventCreatedModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  eventData
}) => {
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const eventLink = `https://connectsphere.app/event/${Math.random().toString(36).substr(2, 9)}`;

  const handleBuddyToggle = (buddyId: string) => {
    setSelectedBuddies(prev => 
      prev.includes(buddyId) 
        ? prev.filter(id => id !== buddyId)
        : [...prev, buddyId]
    );
  };

  const filteredBuddies = mockBuddies.filter(buddy => 
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleMoreOptions = (action: string) => {
    switch(action) {
      case 'edit':
        toast.info('Opening event editor...');
        break;
      case 'announce':
        toast.info('Creating announcement...');
        break;
      case 'calendar':
        toast.success('Event added to calendar!');
        break;
      case 'delete':
        toast.error('Event deleted', {
          description: 'Your event has been removed'
        });
        onClose();
        break;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData?.eventName || 'ConnectSphere Event',
        text: `Join me for ${eventData?.activity} on ${eventData?.date}!`,
        url: eventLink,
      }).catch(() => {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(eventLink).then(() => {
          toast.success('Link copied to clipboard!');
        }).catch(() => {
          toast.error('Failed to share event');
        });
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(eventLink).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  const handleSendInvites = () => {
    if (selectedBuddies.length > 0) {
      toast.success(`Invitations sent to ${selectedBuddies.length} people!`);
      onClose();
    } else {
      toast.error('Please select at least one person to invite');
    }
  };

  const renderMainContent = () => (
    <div className="space-y-6">
      {/* Event Card */}
      {eventData && (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* 16:9 Event Image */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <ImageWithFallback
              src={eventData.selectedImage}
              alt={eventData.eventName}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            
            {/* More Options Dropdown */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/20">
                  <DropdownMenuItem onClick={() => handleMoreOptions('edit')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMoreOptions('announce')}>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Announce
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMoreOptions('calendar')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleMoreOptions('delete')}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent">
              <div className="space-y-3">
                {/* Event Title */}
                <h2 className="text-2xl font-bold text-gray-900">{eventData.eventName}</h2>
                
                {/* Event Type & Privacy - Moved below title */}
                <div className="flex items-center gap-2">
                  <span className="choice-chip selected text-xs px-3 py-1">
                    {eventData.activity}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                    {eventData.isPrivate !== false ? (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    📅 {eventData.date} at {eventData.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {eventData.location || 'Location to be announced'}
                  </p>
                  
                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Created by {eventData.creator || 'You'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Event Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-section-header font-semibold">Share Event</h3>
        </div>
        
        {/* Event Link */}
        <div className="flex gap-2">
          <Input
            value={eventLink}
            readOnly
            className="glass-card border-white/20 rounded-xl flex-1 text-sm"
          />
          <Button
            onClick={handleCopyLink}
            className="rounded-xl px-4 shrink-0"
            variant={copied ? "default" : "outline"}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button
          onClick={handleShare}
          className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-gray-200"
          style={{ fontSize: '17px' }}
        >
          <Share2 className="mr-2 w-5 h-5" />
          Share Event
        </Button>
      </div>

      <Separator className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20" />

      {/* Create Group Chat Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-section-header font-semibold">Create Group Chat</h3>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-purple-200/50">
          <p className="text-sm text-gray-600 mb-3">
            Start a group conversation for all event participants to coordinate, share updates, and get excited together!
          </p>
          <Button
            onClick={() => {
              toast.success('Group chat created!', {
                description: `"${eventData?.eventName}" chat is ready for your event participants`,
              });
              // Navigate to Messages page
              if (onNavigate) {
                onNavigate('messages');
                onClose();
              }
            }}
            className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-gray-200"
            style={{ fontSize: '17px' }}
          >
            <MessageCircle className="mr-2 w-5 h-5" />
            Start Group Chat
          </Button>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-purple-500/20 to-pink-500/20" />

      {/* Add People Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-section-header font-semibold">Add People</h3>
        </div>
        
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card border-white/20 rounded-xl pl-10"
          />
        </div>

        {/* People List */}
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {filteredBuddies.map((buddy) => (
            <button
              key={buddy.id}
              onClick={() => handleBuddyToggle(buddy.id)}
              className={`w-full glass-card p-3 rounded-xl transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedBuddies.includes(buddy.id)
                  ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
                  : 'hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <h4 className="text-body font-medium">{buddy.name}</h4>
                  <p className="text-xs text-muted-foreground">{buddy.username}</p>
                </div>
                {selectedBuddies.includes(buddy.id) && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
          
          {filteredBuddies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No friends found</p>
              <p className="text-xs text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </div>

        {/* Send Invites Button */}
        {selectedBuddies.length > 0 && (
          <Button
            onClick={handleSendInvites}
            className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-gray-200"
            style={{ fontSize: '17px' }}
          >
            <UserPlus className="mr-2 w-5 h-5" />
            Send Invites to {selectedBuddies.length} {selectedBuddies.length === 1 ? 'Person' : 'People'}
          </Button>
        )}
      </div>

      {/* Skip Option */}
      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          I'll do this later
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-lg max-h-[95vh] p-0 overflow-hidden">
        <div className="glass-card flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <DialogHeader className="px-4 py-4 bg-gradient-to-r from-green-50 via-blue-50 to-cyan-50 border-b border-white/20 flex-shrink-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '16px', lineHeight: '1.3' }}>
                    Congratulations! Your Event is Live! 🎉✨
                  </DialogTitle>
                  <p className="text-gray-600 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '11px' }}>
                    Share it with friends and others to join the fun!
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/20 shrink-0 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              Your event has been created successfully. Share the event link or invite people to join.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
            {renderMainContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreatedModal;