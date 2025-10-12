import React, { useState } from 'react';
import { X, UserPlus, Copy, Check, Search, Calendar, Clock, MapPin, Trash2, Edit, MoreHorizontal, MessageCircle, Share2, QrCode, Mail, Send, Users, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { timeSlots } from './OnboardingNew';
import yellowTextureBg from '@/assets/yellow-texture-bg.png';

interface PairingCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  pairingData?: {
    title: string;
    activity: string;
    availableDays: string[];
    availableTimes: string[];
    location?: string;
    customDate?: string;
    customTime?: string;
    hasCustomDateTime?: boolean;
    repeat?: string;
    repeatEndDate?: string;
    hasRepeat?: boolean;
    description?: string;
    invitedBuddies?: string[];
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

export const PairingCreatedModal: React.FC<PairingCreatedModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  pairingData
}) => {
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteList, setShowInviteList] = useState(false);
  const [showExternalShare, setShowExternalShare] = useState(false);
  const [showShareSection, setShowShareSection] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showCopiedLink, setShowCopiedLink] = useState(false);
  const [inviteCancelled, setInviteCancelled] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'pending' | 'accepted' | null>(
    pairingData?.invitedBuddies && pairingData.invitedBuddies.length > 0 ? 'pending' : null
  );
  
  // Get the invited buddy if one exists (but only if not cancelled)
  const invitedBuddy = !inviteCancelled && pairingData?.invitedBuddies && pairingData.invitedBuddies.length > 0
    ? mockBuddies.find(b => b.id === pairingData.invitedBuddies?.[0])
    : null;

  const hasInviteSent = Boolean((invitedBuddy || inviteStatus) && !inviteCancelled);

  const pairingLink = `https://connectsphere.app/pairing/${Math.random().toString(36).substr(2, 9)}`;

  const handleBuddyToggle = (buddyId: string) => {
    // Only allow selecting one person at a time
    setSelectedBuddy(prev => prev === buddyId ? null : buddyId);
  };

  const filteredBuddies = mockBuddies.filter(buddy => 
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pairingLink);
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
          title: pairingData?.activity || 'Join my activity',
          text: `Join me for ${pairingData?.activity}!`,
          url: pairingLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleSendInvite = () => {
    if (selectedBuddy) {
      setInviteStatus('pending');
      setInviteCancelled(false);
      setShowInviteList(false);
      toast.success('Invitation sent!');
    } else {
      toast.error('Please select a person to invite');
    }
  };

  const handleCancelInvite = () => {
    setInviteStatus(null);
    setSelectedBuddy(null);
    setInviteCancelled(true);
    toast.info('Invitation cancelled');
  };

  const handleMoreOptions = (action: string) => {
    switch(action) {
      case 'edit':
        if (onEdit) {
          onEdit();
        } else {
          toast.info('Edit functionality not available');
        }
        break;
      case 'delete':
        if (onDelete) {
          onDelete();
        } else {
          toast.info('Delete functionality not available');
        }
        break;
    }
  };

  const handleSharePlatform = (platform: string) => {
    const text = `Join me for ${pairingData?.activity}! ${pairingLink}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(pairingLink);

    let shareUrl = '';
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'messenger':
        shareUrl = `fb-messenger://share?link=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Join me for ${pairingData?.activity}!`)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Join me for ${pairingData?.activity}`)}&body=${encodedText}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleGeneralShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pairingData?.title || 'ConnectSphere Pairing',
        text: `Looking for a ${pairingData?.activity} partner!`,
        url: pairingLink,
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  // Format time slots for display
  const getTimeSlotLabels = (timeIds: string[]) => {
    return timeIds.map(id => {
      const slot = timeSlots.find(s => s.id === id);
      return slot ? `${slot.icon} ${slot.label}` : id;
    }).join(', ');
  };

  const selectedBuddyData = selectedBuddy ? mockBuddies.find(b => b.id === selectedBuddy) : null;
  const displayBuddy = invitedBuddy || selectedBuddyData;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-[95vw] md:max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <div className="glass-card flex flex-col h-full overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-section-header font-semibold">
                Your Pairing Request is Live! 🎉✨
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
              Your 1:1 pairing request has been created successfully
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0">
            {/* Pairing Card */}
            {pairingData && (
              <div 
                className="relative overflow-hidden rounded-2xl shadow-xl border border-amber-300"
                style={{
                  backgroundImage: `url(${yellowTextureBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Semi-transparent overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/10"></div>
                
                <div className="p-6 relative">
                  {/* Header with More Options */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-3 py-1 bg-amber-900/90 text-amber-50 rounded-full font-semibold shadow-md backdrop-blur-sm">
                          {pairingData.activity}
                        </span>
                      </div>
                      <h2 className="font-bold text-amber-950" style={{ fontSize: '20px' }}>
                        {pairingData.title}
                      </h2>
                    </div>
                    
                    {/* More Options Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-white/20">
                        <DropdownMenuItem onClick={() => handleMoreOptions('edit')}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Pairing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleMoreOptions('delete')}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Pairing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Pairing Details */}
                  <div className="space-y-3">
                    {/* Days */}
                    {pairingData.availableDays && pairingData.availableDays.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 mb-1 font-medium">Available Days</p>
                          <p className="text-sm text-amber-950 font-medium">
                            {pairingData.availableDays.join(', ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Time Slots */}
                    {pairingData.availableTimes && pairingData.availableTimes.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 mb-1 font-medium">Preferred Times</p>
                          <p className="text-sm text-amber-950 font-medium">
                            {getTimeSlotLabels(pairingData.availableTimes)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Custom Date/Time */}
                    {pairingData.hasCustomDateTime && pairingData.customDate && pairingData.customTime && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 mb-1 font-medium">Specific Date & Time</p>
                          <p className="text-sm text-amber-950 font-medium">
                            {new Date(pairingData.customDate).toLocaleDateString('en-GB', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {pairingData.customTime}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Repeat */}
                    {pairingData.hasRepeat && pairingData.repeat && pairingData.repeat !== 'never' && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 mb-1 font-medium">Repeats</p>
                          <p className="text-sm text-amber-950 font-medium">
                            {pairingData.repeat.charAt(0).toUpperCase() + pairingData.repeat.slice(1)}
                            {pairingData.repeatEndDate && ` until ${new Date(pairingData.repeatEndDate).toLocaleDateString('en-GB')}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {pairingData.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-700 mb-1 font-medium">Location</p>
                          <p className="text-sm text-amber-950 font-medium">{pairingData.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {pairingData.description && (
                      <div className="mt-4 pt-4 border-t border-amber-800/20">
                        <p className="text-xs text-amber-700 mb-2 font-medium">Description</p>
                        <p className="text-sm text-amber-950">{pairingData.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Invitation Status - Show when someone is invited */}
            {hasInviteSent && displayBuddy && (
              <>
                <Separator className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20" />
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Invitation Sent! 📬
                    </h3>
                    <p className="text-sm text-gray-600">
                      Waiting for their response
                    </p>
                  </div>

                  {/* Invited Person Card */}
                  <div className="glass-card border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={displayBuddy.avatar}
                          alt={displayBuddy.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{displayBuddy.name}</h4>
                          <p className="text-sm text-gray-500">{displayBuddy.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="choice-chip bg-yellow-100 text-yellow-700 text-xs px-3 py-1">
                          Pending
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelInvite}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Share Section - Show when NO one is invited */}
            {!hasInviteSent && (
              <>
                <Separator className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20" />
                
                {/* Invite Platform Users - Priority Section */}
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

                        {selectedBuddy && mockBuddies.find(b => b.id === selectedBuddy) && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2.5 rounded-xl border-2 border-blue-300 animate-scale-in">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px]">
                              <ImageWithFallback
                                src={mockBuddies.find(b => b.id === selectedBuddy)!.avatar}
                                alt={mockBuddies.find(b => b.id === selectedBuddy)!.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 flex-1">
                              {mockBuddies.find(b => b.id === selectedBuddy)!.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedBuddy(null)}
                              className="w-7 h-7 rounded-full bg-white hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                            >
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {filteredBuddies.slice(0, 5).map((buddy) => {
                            const isSelected = selectedBuddy === buddy.id;
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

                        {selectedBuddy && (
                          <Button
                            onClick={handleSendInvite}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-11"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Invitation
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
                              <p className="text-sm font-mono text-gray-800 truncate">{pairingLink}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Platform Options - Compact 4 per row, smaller, rounder, no borders */}
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
                            onClick={() => handleSharePlatform('twitter')}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-700">X</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleNativeShare}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group col-span-2"
                          >
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-700">More Options</span>
                          </button>
                        </div>
                      )}

                      {/* QR Code Display */}
                      {showQRCode && (
                        <div className="bg-white rounded-2xl p-6 border-2 border-cyan-200 animate-scale-in">
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                              <div className="w-56 h-56 bg-white rounded-2xl p-4 shadow-2xl border-4 border-cyan-100">
                                <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_60%)]"></div>
                                  <QrCode className="w-28 h-28 text-cyan-600 relative z-10" />
                                </div>
                              </div>
                              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="text-center">
                              <h4 className="font-bold text-gray-900 mb-1">Scan to Join</h4>
                              <p className="text-xs text-gray-500 max-w-xs">Share this QR code for instant access to your pairing request</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}


            {/* Invite List - Shown when Invite button is clicked */}
            {showInviteList && (
              <>
                <Separator className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20" />
                <div className="space-y-4">
                  <h3 className="text-section-header font-semibold">Invite Someone</h3>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-card border-white/20 rounded-xl h-12"
                    />
                  </div>

                  {/* Connections List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredBuddies.map((buddy) => {
                      const isSelected = selectedBuddy === buddy.id;
                      return (
                        <button
                          key={buddy.id}
                          onClick={() => handleBuddyToggle(buddy.id)}
                          className={`w-full glass-card p-3 rounded-xl transition-all duration-200 hover:shadow-lg ${
                            isSelected 
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
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Send Invite Button */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowInviteList(false)}
                      variant="outline"
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendInvite}
                      disabled={!selectedBuddy}
                      className="flex-1 bg-white text-gray-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-gray-200"
                      style={{ fontSize: '17px' }}
                    >
                      <UserPlus className="mr-2 w-5 h-5" />
                      Send Invite
                    </Button>
                  </div>

                  {/* Invite Others Not on Platform - Shown in Invite flow */}
                  <div className="pt-4 mt-4 border-t-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Can't find who you're looking for?</p>
                    <Button
                      onClick={() => setShowExternalShare(!showExternalShare)}
                      variant="outline"
                      className="w-full rounded-xl py-3 border-2 hover:bg-blue-50"
                    >
                      <Share2 className="mr-2 w-5 h-5" />
                      Invite Others Not on Platform
                    </Button>
                  </div>

                  {/* External Share Section - Shown when expanded within Invite flow */}
                  {showExternalShare && (
                    <div className="space-y-4 pt-3 border-t border-gray-100">
                      <h3 className="text-section-header font-semibold">Share Outside Platform</h3>

                      {/* QR Code Placeholder */}
                      <div className="flex flex-col items-center gap-3 p-6 glass-card rounded-2xl">
                        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border-2 border-gray-200">
                          <QrCode className="w-32 h-32 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-500 text-center">Scan to join pairing</p>
                      </div>

                      {/* Link with Copy */}
                      <div className="flex gap-2">
                        <Input
                          value={pairingLink}
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

                      {/* Share Options */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Share via:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={() => handleSharePlatform('sms')}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            onClick={() => handleSharePlatform('whatsapp')}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </Button>
                          <Button
                            onClick={() => handleSharePlatform('messenger')}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Messenger
                          </Button>
                          <Button
                            onClick={() => handleSharePlatform('telegram')}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Telegram
                          </Button>
                          <Button
                            onClick={() => handleSharePlatform('email')}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            onClick={handleGeneralShare}
                            variant="outline"
                            className="rounded-xl justify-start"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            More Options
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Action Buttons */}
          {!showInviteList && (
            <div className="px-6 py-4 border-t border-white/20">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold hover:shadow-lg transition-shadow"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PairingCreatedModal;
