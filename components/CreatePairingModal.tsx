import React, { useState } from 'react';
import { X, MapPin, Users, Zap, Search, Repeat, Calendar, Check, Copy, Share2, QrCode, ChevronDown, ChevronUp, Send, MessageCircle, Mail, Plane } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChoiceButton } from './ChoiceButton';
import { activities, timeSlots } from './OnboardingNew';
import { Textarea } from './ui/textarea';

interface CreatePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePairing: (pairingData: any) => void;
  editMode?: boolean;
  initialData?: {
    title?: string;
    activity?: string;
    description?: string;
    location?: string;
  };
}

interface Buddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isSelected: boolean;
}

// Mock buddies data
const mockBuddies: Buddy[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    username: '@sarahk',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=150&h=150&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: '@mikec',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '3',
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '4',
    name: 'Emma Davis',
    username: '@emmad',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isSelected: false
  }
];

// Days of week - "Any" is the default option
const daysOfWeek = ['Any', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Repeat options
const repeatOptions = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

// Location suggestions (Swedish cities)
const locationSuggestions = [
  { name: 'Stockholm Central', address: 'Stockholm, Sweden' },
  { name: 'Södermalm', address: 'Stockholm, Sweden' },
  { name: 'Östermalm', address: 'Stockholm, Sweden' },
  { name: 'Gamla Stan', address: 'Stockholm, Sweden' },
  { name: 'Norrmalm', address: 'Stockholm, Sweden' },
  { name: 'Vasastan', address: 'Stockholm, Sweden' },
  { name: 'Kista', address: 'Stockholm, Sweden' },
  { name: 'Gothenburg Central', address: 'Gothenburg, Sweden' },
  { name: 'Malmö Central', address: 'Malmö, Sweden' },
  { name: 'Uppsala', address: 'Uppsala, Sweden' }
];

// Helper function to get next hour
const getNextHour = () => {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  return nextHour.toTimeString().slice(0, 5); // Format as HH:MM
};

// Helper function to get today's date
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const CreatePairingModal: React.FC<CreatePairingModalProps> = ({
  isOpen,
  onClose,
  onCreatePairing,
  editMode = false,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    activity: '',
    customActivity: '',
    availableDays: ['Any'] as string[], // "Any" selected by default
    availableTimes: [] as string[],
    location: '',
    customDate: getTodayDate(),
    customTime: getNextHour(),
    hasCustomDateTime: false,
    repeat: 'never',
    repeatEndDate: '',
    hasRepeat: false,
    description: ''
  });

  const [selectedBuddies, setSelectedBuddies] = useState<Buddy[]>([]);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const [activitySuggestions, setActivitySuggestions] = useState<string[]>([]);
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);
  const [locationSuggestionsState, setLocationSuggestionsState] = useState<typeof locationSuggestions>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showShareSection, setShowShareSection] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopiedLink, setShowCopiedLink] = useState(false);

  // Generate a preview link for sharing
  const previewLink = `https://connectsphere.app/pairing/preview-${Math.random().toString(36).substr(2, 9)}`;

  // Initialize form data from initialData if in edit mode
  React.useEffect(() => {
    if (editMode && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [editMode, initialData]);

  const handleActivityChange = (value: string) => {
    // Limit to 20 characters and two words
    if (value.length > 20) return;
    
    // Count words - split by spaces and filter empty strings
    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 2 && value.trim().split(/\s+/).length > 2) return;
    
    setFormData(prev => ({ ...prev, activity: value }));
    
    if (value.length > 1 && value !== 'Other') {
      const suggestions = activities.filter(activity =>
        activity.toLowerCase().includes(value.toLowerCase())
      );
      setActivitySuggestions(suggestions);
      setShowActivitySuggestions(suggestions.length > 0 && !suggestions.includes(value));
    } else {
      setShowActivitySuggestions(false);
    }
  };

  const selectActivitySuggestion = (activity: string) => {
    setFormData(prev => ({ ...prev, activity }));
    setShowActivitySuggestions(false);
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    
    if (value.length > 1) {
      const filtered = locationSuggestions.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.address.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestionsState(filtered);
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocationSuggestion = (location: typeof locationSuggestions[0]) => {
    setFormData(prev => ({ ...prev, location: location.name }));
    setShowLocationSuggestions(false);
  };

  const toggleSelection = (val: string, key: 'availableDays' | 'availableTimes') => {
    setFormData((prev) => {
      let newArray: string[];
      
      if (key === 'availableDays') {
        // Special handling for "Any"
        if (val === 'Any') {
          // If clicking "Any", select only "Any" and unselect all others
          newArray = prev[key].includes('Any') ? [] : ['Any'];
        } else {
          // If clicking a specific day
          if (prev[key].includes(val)) {
            // Unselect the day
            newArray = prev[key].filter((v) => v !== val);
          } else {
            // Select the day and unselect "Any"
            newArray = [...prev[key].filter(v => v !== 'Any'), val];
          }
          
          // Check if all days (Mon-Sun) are now selected
          const specificDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const allDaysSelected = specificDays.every(day => newArray.includes(day));
          
          // If all days are selected, revert to "Any"
          if (allDaysSelected) {
            newArray = ['Any'];
          }
        }
      } else {
        // Normal toggle for time slots
        newArray = prev[key].includes(val)
          ? prev[key].filter((v) => v !== val)
          : [...prev[key], val];
      }
      
      const newData = {
        ...prev,
        [key]: newArray,
      };
      
      // If selecting a time slot, disable custom date/time
      if (key === 'availableTimes' && !prev[key].includes(val)) {
        newData.hasCustomDateTime = false;
      }
      
      return newData;
    });
  };

  const toggleCustomDateTime = () => {
    setFormData(prev => ({
      ...prev,
      hasCustomDateTime: !prev.hasCustomDateTime,
      // If enabling custom date/time, clear time slots and days
      availableTimes: !prev.hasCustomDateTime ? [] : prev.availableTimes,
      availableDays: !prev.hasCustomDateTime ? [] : prev.availableDays
    }));
  };

  const toggleRepeat = () => {
    const newHasRepeat = !formData.hasRepeat;
    setFormData(prev => ({
      ...prev,
      hasRepeat: newHasRepeat,
      repeat: newHasRepeat ? 'weekly' : 'never'
      // Repeat does not automatically enable custom date/time
    }));
  };

  const filteredBuddies = mockBuddies.filter(buddy =>
    buddy.name.toLowerCase().includes(inviteSearchQuery.toLowerCase()) ||
    buddy.username.toLowerCase().includes(inviteSearchQuery.toLowerCase())
  );

  const toggleBuddySelection = (buddyId: string) => {
    const buddy = mockBuddies.find(b => b.id === buddyId);
    if (!buddy) return;

    setSelectedBuddies(prev => {
      const isSelected = prev.some(b => b.id === buddyId);
      if (isSelected) {
        return prev.filter(b => b.id !== buddyId);
      } else {
        // Only allow selecting one person for 1:1 pairing
        return [{ ...buddy, isSelected: true }];
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(previewLink);
      setCopied(true);
      setShowCopiedLink(true);
      setShowQRCode(false);
      setShowPlatforms(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy');
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
          title: formData.activity || 'Join my activity',
          text: `Join me for ${formData.activity}!`,
          url: previewLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleSharePlatform = (platform: string) => {
    const text = `Join me for ${formData.activity}! ${previewLink}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(previewLink);

    let shareUrl = '';
    switch(platform) {
      case 'sms':
        shareUrl = `sms:?body=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'messenger':
        shareUrl = `fb-messenger://share?link=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Join me for ${formData.activity}!`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Join me for ${formData.activity}`)}&body=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleSubmit = () => {
    const pairingData = {
      ...formData,
      activity: formData.activity === 'Other' ? formData.customActivity : formData.activity,
      invitedBuddies: selectedBuddies.map(b => b.id),
      createdAt: new Date().toISOString()
    };
    onCreatePairing(pairingData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      activity: '',
      customActivity: '',
      availableDays: ['Any'], // "Any" selected by default
      availableTimes: [],
      location: '',
      customDate: getTodayDate(),
      customTime: getNextHour(),
      hasCustomDateTime: false,
      repeat: 'never',
      repeatEndDate: '',
      hasRepeat: false,
      description: ''
    });
    setSelectedBuddies([]);
    setInviteSearchQuery('');
  };

  // Buddy selection is now optional - allow creating without selecting anyone
  const canSubmit = formData.title && formData.activity && (formData.availableDays.length > 0 || formData.hasCustomDateTime) && (formData.availableTimes.length > 0 || formData.hasCustomDateTime);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="glass-card border-0 max-w-[95vw] md:max-w-4xl max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">
                  {editMode ? 'Edit 1:1 Pairing' : 'Create 1:1 Pairing'}
                </DialogTitle>
              </div>
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
              Create a new 1:1 pairing request to find a partner. Fill out the details below to get started.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(95vh-140px)]">
            
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Title *</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Running Partner Needed"
                  value={formData.title}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v.length <= 30) setFormData(prev => ({ ...prev, title: v }));
                  }}
                  maxLength={30}
                  className="glass-card border-white/20 rounded-xl h-12 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {formData.title.length}/30
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Activity *</Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g., Tennis, Yoga..."
                    value={formData.activity}
                    onChange={(e) => handleActivityChange(e.target.value)}
                    maxLength={20}
                    className="glass-card border-white/20 rounded-xl h-12 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {formData.activity.length}/20
                  </div>
                </div>
                {showActivitySuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl p-2 z-50 max-h-48 overflow-y-auto">
                    {activitySuggestions.map((activity, index) => (
                      <button
                        key={index}
                        onClick={() => selectActivitySuggestion(activity)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        {activity}
                      </button>
                    ))}
                    {activitySuggestions.length === 0 && formData.activity && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No matches found. 
                        <button
                          onClick={() => {
                            if (formData.activity.length <= 20) {
                              setFormData(prev => ({ ...prev, activity: 'Other', customActivity: formData.activity }));
                              setShowActivitySuggestions(false);
                            }
                          }}
                          className="ml-1 text-blue-600 hover:underline"
                          disabled={formData.activity.length > 20}
                        >
                          Use "{formData.activity.slice(0, 20)}" as custom activity
                        </button>
                        {formData.activity.length > 20 && (
                          <div className="text-xs text-red-500 mt-1">Activities limited to 20 characters, 2 words max</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.activity === 'Other' && (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter custom activity (2 words max)"
                    value={formData.customActivity}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.length <= 20) {
                        const words = v.trim().split(/\s+/).filter(w => w.length > 0);
                        if (words.length <= 2 || v.trim().split(/\s+/).length <= 2) {
                          setFormData(prev => ({ ...prev, customActivity: v }));
                        }
                      }
                    }}
                    maxLength={20}
                    className="glass-card border-white/20 rounded-xl h-12 pr-12 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {formData.customActivity.length}/20
                  </div>
                </div>
              )}
            </div>

            {/* Days */}
            <div className="space-y-3">
              <Label className="text-body font-semibold">Days *</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <ChoiceButton
                    key={day}
                    selected={formData.availableDays.includes(day)}
                    onClick={() => toggleSelection(day, 'availableDays')}
                    disabled={formData.hasCustomDateTime}
                    className="px-4 py-2"
                  >
                    {day}
                  </ChoiceButton>
                ))}
              </div>
              {formData.hasCustomDateTime && (
                <p className="text-xs text-muted-foreground">Days disabled when using custom date/time</p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-3">
              <Label className="text-body font-semibold">Time *</Label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <ChoiceButton
                    key={slot.id}
                    selected={formData.availableTimes.includes(slot.id)}
                    onClick={() => toggleSelection(slot.id, 'availableTimes')}
                    disabled={formData.hasCustomDateTime}
                    className="flex flex-col items-center p-4 rounded-2xl"
                  >
                    <span className="text-lg mb-1">{slot.icon}</span>
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-xs opacity-75">{slot.time}</span>
                  </ChoiceButton>
                ))}
              </div>
              {formData.hasCustomDateTime && (
                <p className="text-xs text-muted-foreground">Time slots disabled when using custom date/time</p>
              )}
            </div>

            {/* Optional Section Header */}
            <div className="pt-2">
              <h3 className="text-body font-semibold text-muted-foreground">Optional</h3>
              <div className="w-full h-px bg-gradient-to-r from-blue-500/20 to-cyan-400/20 mt-2"></div>
            </div>

            {/* Custom Date/Time & Repeat - One Row Layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Custom Date/Time - Takes 8 columns */}
              <div className="col-span-8 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Custom Date/Time
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleCustomDateTime}
                    className="h-6 px-2 text-xs rounded-full"
                  >
                    {formData.hasCustomDateTime ? '−' : '+'}
                  </Button>
                </div>
                {formData.hasCustomDateTime && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={formData.customDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, customDate: e.target.value }))}
                      className="glass-card border-white/20 rounded-lg h-10 text-sm"
                    />
                    <Input
                      type="time"
                      value={formData.customTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, customTime: e.target.value }))}
                      className="glass-card border-white/20 rounded-lg h-10 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Repeat - Takes 4 columns */}
              <div className="col-span-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    Repeat
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleRepeat}
                    className="h-6 px-2 text-xs rounded-full"
                  >
                    {formData.hasRepeat ? '−' : '+'}
                  </Button>
                </div>
                {formData.hasRepeat && (
                  <div className="space-y-2">
                    <Select 
                      value={formData.repeat} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, repeat: value }))}
                    >
                      <SelectTrigger className="glass-card border-white/20 rounded-lg h-10 text-sm">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20">
                        {repeatOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.repeat !== 'never' && (
                      <Input
                        type="date"
                        value={formData.repeatEndDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, repeatEndDate: e.target.value }))}
                        className="glass-card border-white/20 rounded-lg h-10 text-sm"
                        placeholder="End date"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location with Smart Suggestions (Optional) */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location (Optional)
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter address or place name..."
                  value={formData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="glass-card border-white/20 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {showLocationSuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl p-2 z-50 max-h-48 overflow-y-auto">
                    {locationSuggestionsState.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocationSuggestion(location)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-muted-foreground">{location.address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description (Optional) */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Description (Optional)</Label>
              <div className="relative">
                <Textarea
                  placeholder="Tell people what to expect..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const v = e.target.value;
                    if (v.length <= 100) setFormData(prev => ({ ...prev, description: v }));
                  }}
                  maxLength={100}
                  className="glass-card border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[100px]"
                  style={{ height: '100px' }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {formData.description.length}/100
                </div>
              </div>
            </div>

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
                        value={inviteSearchQuery}
                        onChange={(e) => setInviteSearchQuery(e.target.value)}
                        className="pl-10 border-gray-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {selectedBuddies.length > 0 && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2.5 rounded-xl border-2 border-blue-300 animate-scale-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px]">
                          <ImageWithFallback
                            src={selectedBuddies[0].avatar}
                            alt={selectedBuddies[0].name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 flex-1">{selectedBuddies[0].name}</span>
                        <button
                          type="button"
                          onClick={() => toggleBuddySelection(selectedBuddies[0].id)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredBuddies.slice(0, 5).map((buddy) => {
                        const isSelected = selectedBuddies.some(b => b.id === buddy.id);
                        return (
                          <button
                            key={buddy.id}
                            type="button"
                            onClick={() => toggleBuddySelection(buddy.id)}
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
                          <p className="text-sm font-mono text-gray-800 truncate">{previewLink}</p>
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
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/20">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200 text-[17px]"
            >
              <Zap className="mr-2 w-5 h-5" />
              {editMode ? 'Update Pairing' : 'Create Pairing Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePairingModal;