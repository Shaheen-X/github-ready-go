import React, { useState } from 'react';
import { X, Share2, Copy, Check, Users, MessageCircle, MoreHorizontal, Edit, Calendar, Volume2, Search, Globe, Lock, User, Trash2, QrCode, Mail, Send, Plane, ChevronDown, ChevronUp } from 'lucide-react';
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
  eventData
}) => {
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareSection, setShowShareSection] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showCopiedLink, setShowCopiedLink] = useState(false);

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
      setShowCopiedLink(true);
      setShowQRCode(false);
      setShowPlatforms(false);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = () => {
    setShowPlatforms(!showPlatforms);
    if (!showPlatforms) {
      setShowQRCode(false);
      setShowCopiedLink(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventData?.eventName || 'Join my event',
          text: `Join me for ${eventData?.activity}!`,
          url: eventLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleSharePlatform = (platform: string) => {
    const text = `Join me for ${eventData?.activity}! ${eventLink}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(eventLink);

    let shareUrl = '';
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'messenger':
        shareUrl = `fb-messenger://share?link=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Join me for ${eventData?.activity}!`)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Join me for ${eventData?.activity}`)}&body=${encodedText}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
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

      <Separator className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20" />

      {/* Invite from Platform - Priority Section */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 p-[1px]">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Invite from Platform</h4>
                <p className="text-xs text-gray-500">Find someone you know</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredBuddies.slice(0, 5).map((buddy) => {
                  const isSelected = selectedBuddies.includes(buddy.id);
                  return (
                    <button
                      key={buddy.id}
                      type="button"
                      onClick={() => handleBuddyToggle(buddy.id)}
                      className={`w-full p-3 rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 shadow-md' 
                          : 'bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${isSelected ? 'bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px]' : ''}`}>
                          <ImageWithFallback
                            src={buddy.avatar}
                            alt={buddy.name}
                            className={`w-full h-full rounded-full object-cover ${isSelected ? '' : 'border-2 border-gray-200'}`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-semibold text-gray-900">{buddy.name}</h4>
                          <p className="text-xs text-gray-500">{buddy.username}</p>
                        </div>
                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedBuddies.length > 0 && (
                <Button
                  onClick={handleSendInvites}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-11"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation{selectedBuddies.length > 1 ? 's' : ''} to {selectedBuddies.length} {selectedBuddies.length === 1 ? 'Person' : 'People'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* External Sharing - Secondary Option */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowShareSection(!showShareSection)}
          className="w-full group"
        >
          <div className="rounded-xl border-2 border-gray-200 hover:border-gray-300 p-4 flex items-center justify-between transition-all duration-200 bg-white hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900">Share Externally</h4>
                <p className="text-xs text-gray-500">Invite via link, QR code, or apps</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
              {showShareSection ? 
                <ChevronUp className="w-4 h-4 text-gray-600" /> : 
                <ChevronDown className="w-4 h-4 text-gray-600" />
              }
            </div>
          </div>
        </button>

        {showShareSection && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Share Grid */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  {copied ? 
                    <Check className="w-5 h-5 text-white" /> : 
                    <Copy className="w-5 h-5 text-white" />
                  }
                </div>
                <span className="text-xs font-semibold text-gray-700">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowQRCode(!showQRCode);
                  if (!showQRCode) {
                    setShowPlatforms(false);
                    setShowCopiedLink(false);
                  }
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 group ${
                  showQRCode 
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-600 shadow-lg shadow-cyan-500/30' 
                    : 'bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                  showQRCode ? 'bg-white/20' : 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-md'
                }`}>
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-semibold ${showQRCode ? 'text-white' : 'text-gray-700'}`}>QR Code</span>
              </button>
              
              <button
                type="button"
                onClick={handleShare}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 group ${
                  showPlatforms
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 shadow-lg shadow-purple-500/30'
                    : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                  showPlatforms ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-md'
                }`}>
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-semibold ${showPlatforms ? 'text-white' : 'text-gray-700'}`}>Share</span>
              </button>
            </div>

            {/* Copied Link Display */}
            {showCopiedLink && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 animate-scale-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 mb-1">Link copied to clipboard</p>
                    <p className="text-sm font-mono text-gray-800 truncate">{eventLink}</p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Display */}
            {showQRCode && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200 text-center animate-scale-in">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">Scan to join event</p>
              </div>
            )}

            {/* Platform Options */}
            {showPlatforms && (
              <div className="grid grid-cols-4 gap-3 animate-scale-in">
                <button
                  type="button"
                  onClick={() => handleSharePlatform('sms')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">SMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSharePlatform('whatsapp')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSharePlatform('messenger')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#0084FF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">Messenger</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSharePlatform('telegram')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#0088cc] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSharePlatform('email')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group col-span-3"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700">More Options</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Done Button */}
      <div className="pt-4">
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold hover:shadow-lg transition-shadow"
        >
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-[95vw] md:max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <div className="glass-card flex flex-col h-full overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-section-header font-semibold">
                Your Event is Live! 🎉✨
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              Your event has been created successfully. Share the event link or invite people to join.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0">
            {renderMainContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreatedModal;