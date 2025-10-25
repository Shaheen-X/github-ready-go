import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Zap, Plus, Repeat, Eye, EyeOff, ChevronDown, Image, Upload, ChevronLeft, ChevronRight, Check, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChoiceButton } from './ChoiceButton';
import { activities } from './OnboardingNew';
import { Textarea } from './ui/textarea';

interface CreateGroupEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
  editMode?: boolean;
  initialData?: {
    eventName?: string;
    activity?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    maxParticipants?: number | null;
    isPrivate?: boolean;
  };
}

interface Buddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isSelected: boolean;
}

// Swedish event themes for gallery
const eventThemes = [
  {
    id: 'midsommar-magic',
    name: 'Midsommar Magic',
    description: 'Flower crowns, maypole, green gradients',
    image: 'https://images.unsplash.com/photo-1602026436208-88899edf43cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRzdW1tZXIlMjBzd2VkZW4lMjBmbG93ZXIlMjBjcm93biUyMG1heXBvbGV8ZW58MXx8fHwxNzU5NjA3NTczfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'fika-fiesta',
    name: 'Fika Fiesta',
    description: 'Coffee cups, cinnamon buns, warm ochre tones',
    image: 'https://images.unsplash.com/photo-1564953112050-951290a2ae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VkaXNoJTIwZmlrYSUyMGNvZmZlZSUyMGNpbm5hbW9uJTIwYnVufGVufDF8fHx8MTc1OTYwNzU3Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'aurora-party',
    name: 'Aurora Party',
    description: 'Swirling purples/greens, starry balloons',
    image: 'https://images.unsplash.com/photo-1586036514314-fce360e1e456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBib3JlYWxpcyUyMG5vcnRoZXJuJTIwbGlnaHRzJTIwc3dlZGVufGVufDF8fHx8MTc1OTYwNzU3OXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'tropical-twist',
    name: 'Tropical Twist',
    description: 'Pineapples with Viking helmets, teal waves',
    image: 'https://images.unsplash.com/photo-1497414146483-5bcafdccfdff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHBpbmVhcHBsZSUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzU5NjA3NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'balloon-bash',
    name: 'Balloon Bash',
    description: 'Yellow/blue orbs, confetti bursts',
    image: 'https://images.unsplash.com/photo-1759054788471-dc7815144604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJhbGxvb25zJTIwcGFydHklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NTk1ODY5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'fruit-frenzy',
    name: 'Fruit Frenzy',
    description: 'Lingonberries/strawberries, red gradients',
    image: 'https://images.unsplash.com/photo-1652208785003-4100305584a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJpZXMlMjBiZXJyaWVzJTIwcmVkJTIwZ3JhZGllbnR8ZW58MXx8fHwxNzU5NjA3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'disco-dalarna',
    name: 'Disco Dalarna',
    description: 'Wooden horse icons, metallic shines',
    image: 'https://images.unsplash.com/photo-1715576565319-728b388d81fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbyUyMG1ldGFsbGljJTIwc2hpbmUlMjBwYXJ0eXxlbnwxfHx8fDE3NTk2MDc1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'rainbow-rave',
    name: 'Rainbow Rave',
    description: 'Pride-flag nods, spectrum arcs',
    image: 'https://images.unsplash.com/photo-1592598419367-41e1f48e3147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluYm93JTIwcHJpZGUlMjBjZWxlYnJhdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc1OTYwNzU5NHww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

// Enhanced Swedish locations with known places
const swedishLocationsWithNames = [
  { address: 'Danmarksgatan 46, 1tr, 164 40 Kista', name: 'Kista Racket Center' },
  { address: 'Centralen, 111 20 Stockholm', name: 'Stockholm Central Station' },
  { address: 'Gamla Stan, 111 29 Stockholm', name: 'Old Town Stockholm' },
  { address: 'Götaplatsen, 412 56 Göteborg', name: 'Götaplatsen' },
  { address: 'Centralplan 15, 211 20 Malmö', name: 'Malmö Central Station' },
  { address: 'Stortorget 8, 753 10 Uppsala', name: 'Uppsala Town Square' },
  { address: 'Lilla Torg, 211 34 Malmö', name: 'Lilla Torg' },
  { address: 'Slottsskogen, 413 27 Göteborg', name: 'Slottsskogen Park' },
  { address: 'Östermalms Saluhall, 114 42 Stockholm', name: 'Östermalm Food Hall' },
  { address: 'Södermalm, 116 64 Stockholm', name: 'Södermalm District' },
  { address: 'Kyrkogatan 6, 222 22 Lund', name: 'Lund Cathedral' },
  { address: 'Turning Torso, 205 05 Malmö', name: 'Turning Torso' },
  { address: 'Örgrytevägen 5, 402 22 Göteborg', name: 'Liseberg' },
  { address: 'Drottninggatan 53, 111 21 Stockholm', name: 'Drottninggatan' },
  { address: 'Kungsgatan 38, 411 15 Göteborg', name: 'Kungsgatan Göteborg' },
  { address: 'Västra Hamnen, 211 18 Malmö', name: 'Västra Hamnen' },
  { address: 'Djurgården 68, 115 21 Stockholm', name: 'Djurgården Island' },
  { address: 'Haga Nygata 12, 413 01 Göteborg', name: 'Haga District' },
  { address: 'Triangeln, 200 10 Malmö', name: 'Triangeln Station' },
  { address: 'Vasastan, 113 46 Stockholm', name: 'Vasastan District' },
  { address: 'SATS Södermalm, Hornsgatan 98, 118 21 Stockholm', name: 'SATS Södermalm' },
  { address: 'Rålambshovsparken, 112 20 Stockholm', name: 'Rålambshovsparken' },
  { address: 'Djurgården Park Entrance, 115 21 Stockholm', name: 'Djurgården Park Entrance' },
  { address: 'Nacka Nature Reserve, 131 34 Nacka', name: 'Nacka Nature Reserve' }
];

const repeatOptions = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  },
  {
    id: '4',
    name: 'Lars Petersson',
    username: '@larsp',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isSelected: false
  }
];

// Default party vector image
const defaultEventImage = 'https://images.unsplash.com/photo-1758287621899-e0aab2f028f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwdmVjdG9yJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1OTg2Njk3NXww&ixlib=rb-4.1.0&q=80&w=1080';

// Fun Time Picker Component with Swedish 24-hour format
const FunTimePicker: React.FC<{
  value: string;
  onChange: (time: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
}> = ({ value, onChange, onOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value.split(':')[0] || '21');
  const [minutes, setMinutes] = useState(value.split(':')[1] || '00');

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours);
    setMinutes(newMinutes);
    onChange(`${newHours}:${newMinutes}`);
  };

  const toggleOpen = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (newOpen) onOpen?.();
    else onClose?.();
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={toggleOpen}
        className="w-full h-12 glass-card border-white/20 rounded-xl justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>{value || `${hours}:${minutes}`}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 glass-card border-white/20 rounded-xl p-4 z-50 shadow-2xl">
          <div className="flex gap-4 justify-center">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-muted-foreground mb-2">Hours</label>
              <div className="h-32 overflow-y-auto scrollbar-hide bg-white/50 rounded-lg p-2 w-16">
                {hourOptions.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeChange(hour, minutes)}
                    className={`w-full py-2 text-center rounded transition-all duration-200 hover:bg-blue-50 ${
                      hours === hour 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold transform scale-110' 
                        : 'text-foreground hover:scale-105'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center text-2xl font-bold text-blue-500 pt-8">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-muted-foreground mb-2">Minutes</label>
              <div className="h-32 overflow-y-auto scrollbar-hide bg-white/50 rounded-lg p-2 w-16">
                {minuteOptions.filter((_, i) => i % 5 === 0).map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeChange(hours, minute)}
                    className={`w-full py-2 text-center rounded transition-all duration-200 hover:bg-blue-50 ${
                      minutes === minute 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold transform scale-110' 
                        : 'text-foreground hover:scale-105'
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full"
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

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

export const CreateGroupEventModal: React.FC<CreateGroupEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  editMode = false,
  initialData
}) => {
  const [formData, setFormData] = useState({
    eventName: '',
    activity: '',
    customActivity: '',
    date: getTodayDate(),
    time: getNextHour(),
    endDate: '',
    endTime: '',
    hasEndTime: false,
    repeat: 'never',
    repeatEndDate: '',
    hasRepeat: false,
    location: '',
    maxParticipants: '',
    description: '',
    visibility: 'public',
  });
  
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(defaultEventImage);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [locationSuggestions, setLocationSuggestions] = useState<typeof swedishLocationsWithNames>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activitySuggestions, setActivitySuggestions] = useState<string[]>([]);
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const [filteredBuddies, setFilteredBuddies] = useState(mockBuddies);

  // Initialize form with current date and next hour when modal opens, or with edit data
  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        setFormData(prev => ({
          ...prev,
          eventName: initialData.eventName || '',
          activity: initialData.activity || '',
          date: initialData.date || getTodayDate(),
          time: initialData.time || getNextHour(),
          location: initialData.location || '',
          maxParticipants: initialData.maxParticipants?.toString() || '',
          description: initialData.description || '',
          visibility: initialData.isPrivate ? 'private' : 'public',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          date: getTodayDate(),
          time: getNextHour(),
        }));
      }
    }
  }, [isOpen, editMode, initialData]);

  // Filter buddies based on search query
  useEffect(() => {
    const filtered = mockBuddies.filter(buddy =>
      buddy.name.toLowerCase().includes(inviteSearchQuery.toLowerCase()) ||
      buddy.username.toLowerCase().includes(inviteSearchQuery.toLowerCase())
    );
    setFilteredBuddies(filtered);
  }, [inviteSearchQuery]);

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    
    if (value.length > 2) {
      const suggestions = swedishLocationsWithNames.filter(
        location => 
          location.address.toLowerCase().includes(value.toLowerCase()) ||
          location.name.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocationSuggestion = (location: typeof swedishLocationsWithNames[0]) => {
    setFormData(prev => ({ ...prev, location: `${location.name}, ${location.address}` }));
    setShowLocationSuggestions(false);
  };

  const handleActivityChange = (value: string) => {
    // Limit to 30 characters
    if (value.length > 30) return;
    
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

  const handleBuddyToggle = (buddyId: string) => {
    setSelectedBuddies(prev => 
      prev.includes(buddyId) 
        ? prev.filter(id => id !== buddyId)
        : [...prev, buddyId]
    );
  };

  const toggleEndTime = () => {
    setFormData(prev => ({
      ...prev,
      hasEndTime: !prev.hasEndTime,
      endDate: !prev.hasEndTime ? prev.date : '',
      endTime: !prev.hasEndTime ? getNextHour() : ''
    }));
  };

  const toggleRepeat = () => {
    const newHasRepeat = !formData.hasRepeat;
    setFormData(prev => ({
      ...prev,
      hasRepeat: newHasRepeat,
      repeat: newHasRepeat ? 'weekly' : 'never',
      repeatEndDate: ''
    }));
  };

  const selectImageFromGallery = (theme: any) => {
    setSelectedImage(theme.image);
    setShowGallery(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextGalleryImages = () => {
    setGalleryIndex((prev) => (prev + 6 >= eventThemes.length ? 0 : prev + 6));
  };

  const prevGalleryImages = () => {
    setGalleryIndex((prev) => (prev - 6 < 0 ? Math.max(0, eventThemes.length - 6) : prev - 6));
  };

  const visibleThemes = eventThemes.slice(galleryIndex, galleryIndex + 6);

  const handleSubmit = () => {
    const eventData = {
      ...formData,
      activity: formData.activity === 'Other' ? formData.customActivity.trim() : formData.activity,
      selectedImage,
      invitedBuddies: selectedBuddies,
      isPrivate: formData.visibility === 'private',
      creator: 'You',
      createdAt: new Date().toISOString()
    };
    onCreateEvent(eventData);
    onClose();
    
    // Reset form
    setFormData({
      eventName: '',
      activity: '',
      customActivity: '',
      date: getTodayDate(),
      time: getNextHour(),
      endDate: '',
      endTime: '',
      hasEndTime: false,
      repeat: 'never',
      repeatEndDate: '',
      hasRepeat: false,
      location: '',
      maxParticipants: '',
      description: '',
      visibility: 'public',
    });
    setSelectedBuddies([]);
    setSelectedImage(defaultEventImage);
    setShowGallery(false);
    setInviteSearchQuery('');
  };

  const canSubmit = formData.eventName && formData.activity && formData.date && formData.time && formData.location;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-[95vw] md:max-w-4xl max-h-[95vh] p-0">
        <div className="glass-card flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">
                  {editMode ? 'Edit Group Event' : 'Create Group Event'}
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
              Create a new group event to connect with others. Fill out the details below to get started.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(95vh-140px)]">
            
            {/* Event Image Banner */}
            <div className="space-y-3">
              <div className="relative w-full h-40 rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Event banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200"></div>
                
                {/* Overlay buttons on top of image */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGallery(!showGallery)}
                    className="w-12 h-12 glass-card border-white/30 bg-white/20 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center hover:bg-white/30"
                  >
                    <Image className="h-4 w-4 text-white" />
                  </Button>
                  
                  <label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-12 h-12 glass-card border-white/30 bg-white/20 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center hover:bg-white/30"
                      asChild
                    >
                      <div className="cursor-pointer">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Gallery */}
              {showGallery && (
                <div className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-body font-semibold">Choose Theme</h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={prevGalleryImages}
                        disabled={galleryIndex === 0}
                        className="h-8 w-8 rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={nextGalleryImages}
                        disabled={galleryIndex + 6 >= eventThemes.length}
                        className="h-8 w-8 rounded-full"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {visibleThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => selectImageFromGallery(theme)}
                        className="group relative aspect-square rounded-xl overflow-hidden hover:scale-105 transition-all duration-200"
                      >
                        <ImageWithFallback
                          src={theme.image}
                          alt={theme.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-white text-sm font-semibold">{theme.name}</h4>
                          <p className="text-white/80 text-xs line-clamp-1">{theme.description}</p>
                        </div>
                        {selectedImage === theme.image && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Event Name *</Label>
              <Input
                type="text"
                placeholder="Enter event name..."
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                className="glass-card border-white/20 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength={50}
              />
            </div>

            {/* Activity Type with Search */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Activity *</Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search activity..."
                    value={formData.activity}
                    onChange={(e) => handleActivityChange(e.target.value)}
                    maxLength={30}
                    className="glass-card border-white/20 rounded-xl h-12 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {formData.activity.length}/30
                  </div>
                </div>
                {showActivitySuggestions && (
                  <div className="absolute top-full mt-1 w-full glass-card border-white/20 rounded-xl p-2 z-50 max-h-48 overflow-y-auto">
                    {activitySuggestions.map((activity) => (
                      <button
                        key={activity}
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
                          <div className="text-xs text-red-500 mt-1">Custom activities are limited to 20 characters</div>
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
                    placeholder="Enter custom activity"
                    value={formData.customActivity}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.length <= 20) setFormData(prev => ({ ...prev, customActivity: v }));
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

            {/* Location with Smart Suggestions */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location *
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
                    {locationSuggestions.map((location, index) => (
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

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="glass-card border-white/20 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-body font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </Label>
                  <FunTimePicker
                    value={formData.time}
                    onChange={(time) => setFormData(prev => ({ ...prev, time }))}
                  />
                </div>
              </div>
            </div>

            {/* Optional Section Header */}
            <div className="pt-2">
              <h3 className="text-body font-semibold text-muted-foreground">Optional</h3>
              <div className="w-full h-px bg-gradient-to-r from-blue-500/20 to-cyan-400/20 mt-2"></div>
            </div>

            {/* End Time & Repeat - Compact Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* End Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    End Time
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleEndTime}
                    className="h-6 px-2 text-xs rounded-full"
                  >
                    {formData.hasEndTime ? '−' : '+'}
                  </Button>
                </div>
                {formData.hasEndTime && (
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="glass-card border-white/20 rounded-lg h-10 text-sm"
                    />
                  <div className="h-10">
                    <FunTimePicker
                      value={formData.endTime}
                      onChange={(endTime) => setFormData(prev => ({ ...prev, endTime }))}
                    />
                  </div>
                </div>
              )}
              </div>

              {/* Repeat */}
              <div className="space-y-2">
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

            {/* Max Participants */}
            <div className="space-y-2">
              <Label className="text-body font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Max Participants (Optional)
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                className="glass-card border-white/20 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-body font-semibold">Description (Optional)</Label>
              <div className="relative">
                <Textarea
                  placeholder="Tell people what to expect..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const v = e.target.value;
                    if (v.length <= 200) setFormData(prev => ({ ...prev, description: v }));
                  }}
                  maxLength={200}
                  rows={8}
                  className="glass-card border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {formData.description.length}/200
                </div>
              </div>
            </div>

            {/* Who Can See */}
            <div className="space-y-3">
              <Label className="text-body font-semibold">Who can see this event</Label>
              <div className="flex gap-3">
                <ChoiceButton
                  selected={formData.visibility === 'public'}
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                  className="flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <Eye className="w-4 h-4" />
                  Public
                </ChoiceButton>
                <ChoiceButton
                  selected={formData.visibility === 'private'}
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                  className="flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <EyeOff className="w-4 h-4" />
                  Private
                </ChoiceButton>
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.visibility === 'public' 
                  ? 'Anyone can see and join this event' 
                  : 'Only invited people can see and join this event'
                }
              </p>
            </div>

            {/* Invite Others with Search */}
            <div className="space-y-4">
              <Label className="text-body font-semibold">Invite Others (Optional)</Label>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search people to invite..."
                  value={inviteSearchQuery}
                  onChange={(e) => setInviteSearchQuery(e.target.value)}
                  className="glass-card border-white/20 rounded-xl h-12 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Buddy List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                          <Plus className="w-3 h-3 text-white rotate-45" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                {filteredBuddies.length === 0 && inviteSearchQuery && (
                  <div className="text-center py-4 text-muted-foreground">
                    No people found matching "{inviteSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/20">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200"
              style={{ fontSize: '17px' }}
            >
              <Zap className="mr-2 w-5 h-5" />
              {editMode ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupEventModal;