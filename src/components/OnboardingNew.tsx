import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Eye, EyeOff, Check, X, MapPin, Users, Camera, QrCode, Upload, Search, Mail, User, Phone, Shield, Heart, Globe, Plus, Info } from 'lucide-react';
import { motion } from 'framer-motion';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChoiceButton } from './ChoiceButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProfileDB } from '@/hooks/useProfileDB';

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingFlow = 'landing' | 'auth' | 'verification' | 'profile' | 'complete';
type AuthMode = 'login' | 'signup';

// Activity options for selection - ordered by popularity/importance
export const activities = [
  'Gym', 'Running', 'Yoga', 'Swimming', 'Cycling', 'Hiking', 'Tennis', 'Football',
  'Basketball', 'Dancing', 'Boxing', 'Walking', 'Golf', 'Team Sports', 'Fitness Classes',
  'Group Workouts', 'Rock Climbing', 'Badminton', 'Table Tennis', 'Martial Arts',
  'Crossfit', 'Casual Sports', 'Bowling', 'Cricket', 'Hockey', 'Skiing', 'Rowing',
  'Outdoor Adventures', 'Snowboarding', 'Paddleboarding', 'Skateboarding', 'Parkour',
  'Archery', 'Concert', 'Art', 'Painting', 'Support Group', 'Co-Founder'
];

const personalityTraits = [
  'Outgoing and fun', 'Calm and easygoing', 'Friendly and social', 
  'Creative and artistic', 'Focused and hardworking', 'Independent and quiet'
];

const activityLevels = [
  'Lightly active', 'Casually active', 'Regularly active', 'Highly active'
];

const vibePreferences = [
  'Focused and serious', 'Laid-back and fun', 'Competitive spirit', 'No preference'
];

const punctualityLevels = [
  'Very important', 'Somewhat important', 'Time is just numbers'
];

export const timeSlots = [
  { id: 'morning', label: 'Morning', time: '06:00 - 12:00', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 - 16:00', icon: '☀️' },
  { id: 'evening', label: 'Evening', time: '16:00 - 21:00', icon: '🌆' },
  { id: 'night', label: 'Late Night', time: '21:00 - 00:00', icon: '🌙' }
];

const goals = [
  { id: 'staying-active', label: 'Staying active', icon: '🏃‍♂️' },
  { id: 'workout-sessions', label: 'Workout sessions', icon: '🏆' },
  { id: 'friendly-games', label: 'Friendly games', icon: '🎯' },
  { id: 'team-sports', label: 'Team sports', icon: '⚽' },
  { id: 'new-in-town', label: 'New in town', icon: '📍' },
  { id: 'explore-places', label: 'Explore new places', icon: '🌍' },
  { id: 'figuring-out', label: 'Still figuring out', icon: '🤔' },
  { id: 'something-else', label: 'Something else', icon: '✨' },
  { id: 'someone-invited', label: 'Someone invited me', icon: '📱' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [showAccountCreated, setShowAccountCreated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Additional state for new features
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhoneDisclaimer, setShowPhoneDisclaimer] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  
  // State for login input mode (phone/email)
  const [loginInputMode, setLoginInputMode] = useState<'phone' | 'email'>('phone');
  
  // State for remember me checkbox
  const [rememberMe, setRememberMe] = useState(true);
  
  // Profile database hook
  const { completeOnboarding } = useProfileDB();
  
  // Sliding images for landing page - using fresh Unsplash URLs
  const landingImages = [
    "https://images.unsplash.com/photo-1643828302859-026168101b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU4NTc0MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1613539266165-e444d4d3c977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3YWxraW5nJTIwY2l0eSUyMHN0cmVldHxlbnwxfHx8fDE3NTg1NzQzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1738523686534-7055df5858d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBleGVyY2lzaW5nJTIwdG9nZXRoZXIlMjBmaXRuZXNzJTIwZ3ltfGVufDF8fHx8MTc1ODU2MjU2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1612542795178-ef13feed5ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbWVldGluZyUyMHNwb3J0cyUyMG91dGRvb3IlMjBhY3Rpdml0eXxlbnwxfHx8fDE3NTg1NjI1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];

  // Country codes with flags
  const countryCodes = [
    { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
    { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
    { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
    { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
    { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
    { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
    { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
    { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria' },
    { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium' },
    { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
    { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
    { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
    { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
    { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
    { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
    { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
    { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
    { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
    { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
    { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Peru' },
    { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
    { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
    { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
    { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey' },
    { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
    { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland' },
    { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary' },
    { code: '+40', country: 'RO', flag: '🇷🇴', name: 'Romania' },
    { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece' },
    { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' }
  ];

  // Form data state
  const [formData, setFormData] = useState({
    // Auth data
    email: '',
    password: '',
    phone: '',
    countryCode: '+46',
    
    // Profile data
    firstName: '',
    birthdayDay: '',
    birthdayMonth: '',
    birthdayYear: '',
    gender: '',
    customGender: '',
    showGender: true,
    goals: [] as string[],
    personalityTraits: [] as string[],
    activityLevel: '',
    vibePreference: '',
    punctuality: '',
    selectedActivities: [] as string[],
    customActivity: '',
    availableDays: [] as string[],
    availableTimes: [] as string[],
    customAvailability: '',
    customTime: '',
    preferredDistance: [25],
    isGlobal: false,
    hasPartners: false,
    partnerEmails: [] as string[],
    partnerEmail: '',
    partnerUsername: '',
    searchMethod: 'email' as 'email' | 'username' | 'qr',
    genderPreference: [] as string[],
    ageRange: [18, 65] as number[],
    teamPreferences: [] as string[],
    uploadedPhotos: [] as string[],
    shareContacts: false,
    allowLocation: false,
    avoidColleagues: false,
    avoidFriendsFamily: false
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Validation functions
  // const validateEmail = (email: string) => {
  //   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // };

  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
    
    // Only update state if validation has actually changed
    const currentValidation = passwordValidation;
    const hasChanged = Object.keys(validation).some(
      key => validation[key as keyof typeof validation] !== currentValidation[key as keyof typeof currentValidation]
    );
    
    if (hasChanged) {
      setPasswordValidation(validation);
    }
    
    return Object.values(validation).every(Boolean);
  };

  const isFormValid = useMemo(() => {
    try {
      switch (currentFlow) {
        case 'auth':
          if (authMode === 'login') {
            if (loginInputMode === 'phone') {
              return formData.phone.length >= 7; // Phone login validation
            } else {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.password.length > 0; // Email login validation
            }
          } else {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && Object.values(passwordValidation).every(Boolean);
          }
        case 'verification':
          return formData.phone.length >= 7;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error in isFormValid:', error);
      return false;
    }
  }, [currentFlow, authMode, loginInputMode, formData.email, formData.password, formData.phone, passwordValidation]);

  // Welcome screens removed per user request

  // Profile setup steps - memoized to prevent infinite re-renders
  const profileSteps = useMemo(() => {
    const steps = [
      'First Name',
      'Birthday', 
      'Gender',
      'Goals',
      'About You',
      'Activity Preferences',
      'Availability',
      'Distance',
      'Partner/Team Options',
      'Add Your Partners',
      'Who would you like to team up with?',
      'Photos',
      'Location',
      'Colleagues'
    ];
    
    if (!formData.hasPartners) {
      return steps.filter(step => step !== 'Add Your Partners');
    }
    return steps;
  }, [formData.hasPartners]);

  const totalSteps = profileSteps.length;

  // Progress calculation - Create Account doesn't count as progress
  const getProgress = () => {
    switch (currentFlow) {
      case 'auth':
        return authMode === 'login' ? 20 : 0; // No progress for signup/create account
      case 'verification':
        return 30;
      case 'profile':
        return 30 + ((currentStep + 1) / totalSteps) * 65;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  };

  // Timer for verification
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-sliding images for landing page
  useEffect(() => {
    // Only start the interval if we have images
    if (landingImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % landingImages.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [landingImages.length]);

  // Age calculation helper
  const calculateAge = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return null;
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle password input
  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    validatePassword(value);
  };

  // Handle verification code input
  const handleVerificationInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Navigation functions
  const handleNext = () => {
    try {
      setIsLoading(true);
      
      // Handle different flows
      if (currentFlow === 'auth') {
        if (authMode === 'signup') {
          setCurrentFlow('verification');
        } else {
          // Handle login - go directly to home for both phone and email
          onComplete();
        }
      } else if (currentFlow === 'verification') {
        if (currentStep === 0) {
          setCurrentStep(1);
          setCountdown(60);
        } else {
          // Handle verification completion differently for login vs signup
          if (authMode === 'login') {
            // For login, go directly to complete/home
            setCurrentFlow('complete');
          } else {
            // For signup, show account created popup and continue to profile
            setShowAccountCreated(true);
            setTimeout(() => {
              setShowAccountCreated(false);
              setCurrentFlow('profile');
              setCurrentStep(0);
            }, 2500);
          }
        }
      } else if (currentFlow === 'profile') {
        // Show welcome screen after first name
        if (currentStep === 0 && profileSteps[0] === 'First Name') {
          setShowWelcome(true);
          setTimeout(() => {
            setShowWelcome(false);
            setCurrentStep(currentStep + 1);
          }, 1500);
        } else if (profileSteps[currentStep] === 'Partner/Team Options' && formData.hasPartners) {
          // Auto-advance if partner toggle is selected, keep same progress
          setCurrentStep(currentStep + 1);
        } else if (currentStep < totalSteps - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Save profile data before completing
          const birthDate = formData.birthdayYear && formData.birthdayMonth && formData.birthdayDay
            ? `${formData.birthdayYear}-${formData.birthdayMonth.padStart(2, '0')}-${formData.birthdayDay.padStart(2, '0')}`
            : null;

          completeOnboarding({
            name: formData.firstName,
            date_of_birth: birthDate,
            gender: formData.gender === 'other' ? formData.customGender : formData.gender,
            interests: formData.selectedActivities,
            skill_level: formData.activityLevel,
            preferences: {
              goals: formData.goals,
              personality: formData.personalityTraits,
              vibe: formData.vibePreference,
              punctuality: formData.punctuality,
              availableDays: formData.availableDays,
              availableTimes: formData.availableTimes,
              preferredDistance: formData.preferredDistance[0],
              isGlobal: formData.isGlobal,
              genderPreference: formData.genderPreference,
              ageRange: formData.ageRange,
              teamPreferences: formData.teamPreferences,
              shareContacts: formData.shareContacts,
              allowLocation: formData.allowLocation,
            },
          });
          setCurrentFlow('complete');
        }
      } else if (currentFlow === 'complete') {
        onComplete();
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentFlow === 'auth') {
      setCurrentFlow('landing');
    } else if (currentFlow === 'verification') {
      if (currentStep > 0) {
        setCurrentStep(0);
      } else {
        setCurrentFlow('auth');
      }
    } else if (currentFlow === 'profile') {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        setCurrentFlow('verification');
      }
    }
  };

  // Toggle functions for multi-select
  const toggleSelection = (item: string, field: keyof typeof formData) => {
    setFormData(prev => {
      const currentSelection = prev[field] as string[];
      
      // Special handling for personality traits (max 3)
      if (field === 'personalityTraits') {
        if (currentSelection.includes(item)) {
          return { ...prev, [field]: currentSelection.filter(i => i !== item) };
        } else if (currentSelection.length < 3) {
          return { ...prev, [field]: [...currentSelection, item] };
        }
        return prev; // Don't add if already at max
      }
      
      // Special handling for goals (max 3)
      if (field === 'goals') {
        if (currentSelection.includes(item)) {
          return { ...prev, [field]: currentSelection.filter(i => i !== item) };
        } else if (currentSelection.length < 3) {
          return { ...prev, [field]: [...currentSelection, item] };
        }
        return prev; // Don't add if already at max
      }
      
      // Special handling for gender preference mutual exclusion
      if (field === 'genderPreference') {
        if (item === 'Everyone') {
          return { ...prev, [field]: currentSelection.includes('Everyone') ? [] : ['Everyone'] };
        } else {
          // If selecting Men or Women, remove Everyone
          const withoutEveryone = currentSelection.filter(i => i !== 'Everyone');
          const newSelection = withoutEveryone.includes(item)
            ? withoutEveryone.filter(i => i !== item)
            : [...withoutEveryone, item];
          return { ...prev, [field]: newSelection };
        }
      }
      
      // Default behavior for other fields
      const newSelection = currentSelection.includes(item)
        ? currentSelection.filter(i => i !== item)
        : [...currentSelection, item];
      return { ...prev, [field]: newSelection };
    });
  };

  // Render landing screen with sliding images
  const renderLandingScreen = () => (
    <div className="h-full relative overflow-hidden">
      {/* Background sliding images */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        {landingImages.length > 0 ? landingImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt="ConnectSphere lifestyle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )) : (
          // Fallback gradient background if images fail to load
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400"></div>
        )}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-white">
        {/* Small dot at top */}
        <div className="w-2 h-2 bg-white rounded-full mb-16 opacity-80"></div>
        
        {/* Main icon */}
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-12">
          <User className="text-white" size={40} />
        </div>
        
        {/* Title and description */}
        <div className="text-center mb-20 max-w-sm">
          <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Stronger Every Day!
          </h1>
          <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">
            Consistency is easier when you're not alone — grow with partners and coaches.
          </p>
        </div>
        
        {/* Arrow */}
        <div className="mb-20">
          <ChevronRight className="text-white opacity-80" size={24} />
        </div>
        
        {/* Buttons */}
        <div className="w-full max-w-sm space-y-4 flex flex-col items-center">
          <button
            onClick={() => {
              setAuthMode('signup');
              setCurrentFlow('auth');
            }}
            className="w-full bg-white text-blue-600 font-medium rounded-full py-4 text-lg shadow-lg hover:scale-105 transition-all duration-200 hover:bg-gray-50 text-center flex items-center justify-center"
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setAuthMode('login');
              setCurrentFlow('auth');
            }}
            className="w-full bg-white/20 backdrop-blur-md text-white font-medium rounded-full py-4 text-lg hover:bg-white/30 transition-all duration-200 border border-white/30 text-center flex items-center justify-center"
          >
            Login
          </button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {landingImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );



  // Render auth screen
  const renderAuthScreen = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="p-6 pb-2 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6 flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-section-header gradient-text mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-subtext">
            {authMode === 'login' ? 'Sign in to your account' : 'Join ConnectSphere today'}
          </p>
        </div>

        <div className="space-y-4">
          {authMode === 'login' ? (
            <>
              {/* Login Mode Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setLoginInputMode('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl transition-all ${
                    loginInputMode === 'phone'
                      ? 'bg-white shadow-md text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Phone size={16} />
                  <span className="font-medium">Phone</span>
                </button>
                <button
                  onClick={() => setLoginInputMode('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl transition-all ${
                    loginInputMode === 'email'
                      ? 'bg-white shadow-md text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Mail size={16} />
                  <span className="font-medium">Email</span>
                </button>
              </div>

              {/* Phone/Email Input based on selected mode */}
              {loginInputMode === 'phone' ? (
                <div>
                  <label className="block text-body font-medium mb-2">Phone Number</label>
                  <div className="flex space-x-3">
                    <select
                      className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-w-[120px]"
                      value={formData.countryCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                          if (value.length <= 10) { // Max 10 digits
                            setFormData(prev => ({ ...prev, phone: value }));
                          }
                        }}
                        placeholder="Phone number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-body font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label htmlFor="remember-me" className="text-body font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Password Input for Email Login */}
              {loginInputMode === 'email' && (
                <div>
                  <label className="block text-body font-medium mb-2">Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-12 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Social Sign-in Options for Email Login */}
              {loginInputMode === 'email' && (
                <div className="space-y-4">
                  {/* Divider */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-subtext text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-white border border-gray-200 rounded-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors shadow-sm">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-body font-medium">Continue with Google</span>
                    </button>

                    <button className="w-full bg-black text-white rounded-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors shadow-sm">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <span className="font-medium">Continue with Apple</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Signup Mode - Email Input */}
              <div>
                <label className="block text-body font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-body font-medium mb-2">Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-12 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements (Signup only) */}
              {formData.password && (
                <div className="glass-card p-4">
                  <p className="text-body font-medium mb-2">Password requirements:</p>
                  <div className="space-y-1">
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'uppercase', label: 'One uppercase letter' },
                      { key: 'lowercase', label: 'One lowercase letter' },
                      { key: 'number', label: 'One number' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        {passwordValidation[key as keyof typeof passwordValidation] ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <X size={16} className="text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation[key as keyof typeof passwordValidation] ? 'text-green-600' : 'text-red-600'}`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Sign-in Options (only for signup) */}
              <div className="space-y-4">
                {/* Divider */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-subtext text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-white border border-gray-200 rounded-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-body font-medium">Continue with Google</span>
                  </button>

                  <button className="w-full bg-black text-white rounded-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="font-medium">Continue with Apple</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Toggle Auth Mode */}
        <div className="text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-subtext hover:text-blue-600 transition-colors"
          >
            {authMode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"
            }
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 pt-2">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full h-14 text-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
        >
          {authMode === 'login' 
            ? (loginInputMode === 'phone' ? 'Send Code' : 'Sign In')
            : 'Create Account'
          }
        </button>
      </div>
    </div>
  );

  // Render verification screen
  const renderVerificationScreen = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Progress Bar - only show for signup, not login */}
      {authMode === 'signup' && (
        <div className="h-1 bg-gray-200 relative">
          <div 
            className="h-full progress-gradient transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-2 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        {/* Only show progress percentage for signup */}
        {authMode === 'signup' && (
          <span className="gradient-text font-semibold text-sm">
            {Math.round(getProgress())}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 space-y-6">
        {currentStep === 0 ? (
          // Phone Number Entry
          <>
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Verify Your Number</h1>
              <p className="text-subtext">We'll send you a verification code</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium mb-2">Phone Number</label>
                <div className="flex space-x-3">
                  <select
                    className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-w-[120px]"
                    value={formData.countryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                        if (value.length <= 10) { // Max 10 digits
                          setFormData(prev => ({ ...prev, phone: value }));
                        }
                      }}
                      placeholder="Phone number"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {/* Phone number disclaimer */}
              <div className="flex items-center justify-center">
                <Popover open={showPhoneDisclaimer} onOpenChange={setShowPhoneDisclaimer}>
                  <PopoverTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-700 text-sm underline flex items-center space-x-1">
                      <Info size={14} />
                      <span>What happens if your number changes?</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Phone Number Changes</h3>
                      <p className="text-sm text-gray-600">
                        You can update your phone number anytime in your profile settings.
                      </p>
                      <p className="text-sm text-gray-600">
                        We use your phone number for account security and important notifications. Your number is never shared with other users.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>
        ) : (
          // Verification Code Entry
          <>
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Enter Verification Code</h1>
              <p className="text-subtext">Code sent to {formData.countryCode} {formData.phone}</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl text-center text-body font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={digit}
                    onChange={(e) => handleVerificationInput(index, e.target.value)}
                  />
                ))}
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-subtext">Resend code in {countdown}s</p>
                ) : (
                  <button
                    onClick={() => setCountdown(60)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="p-6 pt-2">
        <button
          onClick={handleNext}
          disabled={currentStep === 0 ? !isFormValid : !verificationCode.every(digit => digit !== '')}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full h-14 text-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
        >
          {currentStep === 0 ? 'Send Code' : 'Verify & Continue'}
        </button>
      </div>
    </div>
  );

  // Render profile setup screens
  const renderProfileScreen = () => {
    const stepName = profileSteps[currentStep];
    // Compute birthday/age helpers to avoid returning string values from && chains
    const isBirthdayStep = stepName === 'Birthday';
    const currentAge = calculateAge(formData.birthdayDay, formData.birthdayMonth, formData.birthdayYear);
    const isUnderage = currentAge !== null && currentAge < 18;

    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 relative">
          <div 
            className="h-full progress-gradient transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <span className="gradient-text font-semibold text-sm ml-auto">
            {Math.round(getProgress())}%
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {renderProfileStep(stepName)}
        </div>

        {/* Navigation */}
          <div className="p-6 pt-2">
          {/* Location warning just above continue button */}
          {profileSteps[currentStep] === 'Location' && !formData.allowLocation && (
            <div className="text-center text-red-600 font-medium mb-4">
              Please enable location access to continue using ConnectSphere
            </div>
          )}
          
          <button
            onClick={handleNext}
            disabled={isBirthdayStep && isUnderage}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full h-14 text-lg hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? 'Complete Profile' : 'Continue'}
          </button>
          <p className="text-center text-subtext mt-2">
            You can change everything later in Settings
          </p>
        </div>
      </div>
    );
  };

  const renderProfileStep = (stepName: string) => {
    switch (stepName) {
      case 'First Name':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">What's your first name?</h1>
              <p className="text-subtext">This is how others will see you</p>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl pl-10 pr-4 py-4 text-body font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Your first name"
                  maxLength={20}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{formData.firstName.length}/20 characters</p>
            </div>
          </div>
        );

      case 'Birthday': {
        const currentAge = calculateAge(formData.birthdayDay, formData.birthdayMonth, formData.birthdayYear);
        const isUnderage = currentAge !== null && currentAge < 18;
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">When's your birthday?</h1>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-body font-medium mb-2">Year</label>
                  <select
                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={formData.birthdayYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdayYear: e.target.value }))}
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 18 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Month</label>
                  <select
                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={formData.birthdayMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdayMonth: e.target.value }))}
                  >
                    <option value="">Month</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Day</label>
                  <select
                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={formData.birthdayDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdayDay: e.target.value }))}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Privacy message moved below inputs */}
              <div className="glass-card p-4 bg-blue-50 border-2 border-blue-200">
                <p className="text-blue-800 font-medium text-lg">
                  🛡️ Your profile shows your age, not your date of birth.
                </p>
              </div>

              {/* Age display and validation */}
              {currentAge !== null && (
                <div className="text-center">
                  {isUnderage ? (
                    <div className="glass-card p-4 border-2 border-red-200 bg-red-50">
                      <div className="text-red-600 font-medium mb-2">
                        Age: {currentAge} years old
                      </div>
                      <p className="text-red-600 text-sm">
                        You must be 18 or older to join ConnectSphere.
                      </p>
                    </div>
                  ) : (
                    <div className="glass-card p-4 border-2 border-green-200 bg-green-50">
                      <div className="text-green-600 font-medium">
                        Age: {currentAge} years old
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'Gender': {
        // const canContinue = formData.gender && (formData.gender !== 'Custom' || formData.customGender.trim() !== '');
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">How do you identify yourself?</h1>
            </div>

            <div className="space-y-4">
              {/* First row: Man and Woman */}
              <div className="flex gap-3 justify-center">
                {['Man', 'Woman'].map((gender) => (
                  <ChoiceButton
                    key={gender}
                    selected={formData.gender === gender}
                    onClick={() => setFormData(prev => ({ ...prev, gender }))}
                    className="text-base px-8 py-3 flex-1 max-w-[160px]"
                  >
                    {gender}
                  </ChoiceButton>
                ))}
              </div>
              
              {/* Second row: Other options - same size as first row */}
              <div className="flex gap-3 justify-center">
                {['Non-binary', 'Custom'].map((gender) => (
                  <ChoiceButton
                    key={gender}
                    selected={formData.gender === gender}
                    onClick={() => setFormData(prev => ({ ...prev, gender }))}
                    className="text-base px-8 py-3 flex-1 max-w-[160px]"
                  >
                    {gender}
                  </ChoiceButton>
                ))}
              </div>

              {formData.gender === 'Custom' && (
                <input
                  type="text"
                  className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.customGender}
                  onChange={(e) => setFormData(prev => ({ ...prev, customGender: e.target.value }))}
                  placeholder="Please specify"
                  maxLength={10}
                  required
                />
              )}


            </div>
          </div>
        );
      }

      case 'Distance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <MapPin className="text-blue-500" size={24} />
              </div>
              <h1 className="text-section-header gradient-text mb-2">Preferred Distance</h1>
              <p className="text-subtext">How far are you willing to travel for activities?</p>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="text-center mb-6">
                                  <div className="text-4xl font-bold gradient-text mb-2">
                                  {formData.isGlobal ? 'Global' : `${formData.preferredDistance[0]} km`}
                  </div>
                  <div className="text-subtext">Maximum distance</div>
                </div>
                
                {!formData.isGlobal && (
                  <>
                    <Slider
                      value={formData.preferredDistance}
                      onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, preferredDistance: value }))}
                      max={50}
                      min={1}
                      step={1}
                      className="mb-6"
                    />
                    
                    <div className="flex justify-between text-subtext text-sm">
                      <span>1 km</span>
                      <span>25 km</span>
                      <span>50 km</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center space-y-4">
                <ChoiceButton
                  selected={formData.isGlobal}
                  onClick={() => setFormData(prev => ({ ...prev, isGlobal: !prev.isGlobal }))}
                  className="flex items-center space-x-2 px-6 py-3"
                >
                  <Globe size={20} />
                  <span>Global - anywhere in the world</span>
                </ChoiceButton>

                <div className="text-body font-medium gradient-text">
                  {formData.isGlobal 
                    ? "Ready for adventures anywhere in the world!"
                    : formData.preferredDistance[0] <= 3 
                    ? "Very local - walking/cycling distance"
                    : formData.preferredDistance[0] <= 10
                    ? "Moderate - short drive or public transport"
                    : formData.preferredDistance[0] <= 25
                    ? "Extended - willing to travel for the right activity"
                    : "Long distance - ready for adventure anywhere"
                  }
                </div>
              </div>
            </div>
          </div>
        );

      case 'Partner/Team Options':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="text-blue-500" size={24} />
              </div>
              <h1 className="text-section-header gradient-text mb-2">Partner/Team Options</h1>
              <p className="text-subtext">Do you already have specific people in mind to exercise with?</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-body font-medium">I already have partner(s) in mind</span>
                    <p className="text-subtext text-sm">Connect with specific people you want to exercise with</p>
                  </div>
                  <Switch
                    checked={formData.hasPartners}
                    onCheckedChange={(checked: boolean) => {
                      setFormData(prev => ({ ...prev, hasPartners: checked }));
                      // Auto-advance if selected
                      if (checked) {
                        setTimeout(() => handleNext(), 500);
                      }
                    }}
                    className={`${!formData.hasPartners ? 'data-[state=unchecked]:bg-gray-300' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'Add Your Partners':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Add Your Partners</h1>
              <p className="text-subtext">Search by email, username, or QR code</p>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-body font-medium">I already have partner(s) in mind</span>
                    <p className="text-subtext text-sm">You can add multiple partners</p>
                  </div>
                  <Switch
                    checked={formData.hasPartners}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, hasPartners: checked }))}
                  />
                </div>
              </div>

              {formData.hasPartners && (
                <div className="space-y-4">
                  {/* Search Method Tabs */}
                  <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                    {[
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'username', label: 'Username', icon: User },
                      { id: 'qr', label: 'QR', icon: QrCode }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setFormData(prev => ({ ...prev, searchMethod: id as 'email' | 'username' | 'qr' }))}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl transition-all ${
                          formData.searchMethod === id
                            ? 'bg-white shadow-md text-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  {formData.searchMethod === 'email' && (
                    <div>
                      <label className="block text-body font-medium mb-2">Partner's Email</label>
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                          <input
                            type="email"
                            className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            value={formData.partnerEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, partnerEmail: e.target.value }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && formData.partnerEmail && formData.partnerEmails.length < 5) {
                                setFormData(prev => ({
                                  ...prev,
                                  partnerEmails: [...prev.partnerEmails, formData.partnerEmail],
                                  partnerEmail: ''
                                }));
                              }
                            }}
                            placeholder="Enter partner's email"
                          />
                        </div>
                        <button
                          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                          disabled={formData.partnerEmails.length >= 5}
                          onClick={() => {
                            if (formData.partnerEmail && formData.partnerEmails.length < 5) {
                              setFormData(prev => ({
                                ...prev,
                                partnerEmails: [...prev.partnerEmails, formData.partnerEmail],
                                partnerEmail: ''
                              }));
                            }
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.searchMethod === 'username' && (
                    <div>
                      <label className="block text-body font-medium mb-2">Partner's Username</label>
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            value={formData.partnerUsername}
                            onChange={(e) => setFormData(prev => ({ ...prev, partnerUsername: e.target.value }))}
                            placeholder="example: @Robinelrix"
                          />
                        </div>
                        <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                          <Search size={16} />
                        </button>
                      </div>
                      <p className="text-subtext text-sm mt-2 text-center">Can be found on partner's profile page</p>
                    </div>
                  )}

                  {formData.searchMethod === 'qr' && (
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                        <QrCode size={48} className="text-gray-400" />
                      </div>
                      <p className="text-subtext mt-4">Scan your partner's QR code</p>
                      <p className="text-subtext text-sm mt-2 text-center">Can be found on partner's profile page</p>
                    </div>
                  )}

                  {formData.partnerEmails.length > 0 && (
                    <div className="glass-card p-4">
                      <h3 className="text-body font-semibold mb-3">Added partners ({formData.partnerEmails.length}/5):</h3>
                      <div className="space-y-2">
                        {formData.partnerEmails.map((email, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/50 rounded-xl p-3">
                            <span className="text-body">{email}</span>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                partnerEmails: prev.partnerEmails.filter((_, i) => i !== index)
                              }))}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'Who would you like to team up with?':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Who would you like to team up with?</h1>
              <p className="text-subtext">Select your preference for activity partners</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {['Men', 'Women', 'Everyone'].map((preference) => (
                  <ChoiceButton
                    key={preference}
                    selected={formData.genderPreference.includes(preference)}
                    onClick={() => toggleSelection(preference, 'genderPreference')}
                    className="text-sm px-6 py-3"
                  >
                    {preference}
                  </ChoiceButton>
                ))}
              </div>

              {/* Age Range */}
              <div className="glass-card p-6">
                <h3 className="text-body font-semibold mb-4">Age Range</h3>
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {formData.ageRange[0]} - {formData.ageRange[1]} years old
                  </div>
                </div>
                
                <Slider
                  value={formData.ageRange}
                    onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, ageRange: value }))}
                  max={80}
                  min={18}
                  step={1}
                  className="mb-6"
                />
                
                <div className="flex justify-between text-subtext text-sm">
                  <span>18</span>
                  <span>50</span>
                  <span>80</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Photos':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Add Photos</h1>
              <p className="text-subtext">Show others who you are (1-6 photos)</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white/90 backdrop-blur-md border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    {formData.uploadedPhotos[index] ? (
                      <div className="relative w-full h-full">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                          <Camera size={32} className="text-blue-500" />
                        </div>
                        <button
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          onClick={() => {
                            const newPhotos = [...formData.uploadedPhotos];
                            newPhotos.splice(index, 1);
                            setFormData(prev => ({ ...prev, uploadedPhotos: newPhotos }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs text-center">Add Photo</span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-start space-x-3">
                  <Camera className="text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-body font-medium">Photo Tips</h3>
                    <ul className="text-subtext text-sm mt-1 space-y-1">
                      <li>• Show your face clearly in at least one photo</li>
                      <li>• Include photos of activities you enjoy</li>
                      <li>• Avoid group photos as your main image</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-4 text-body font-medium hover:border-blue-500 transition-colors flex items-center justify-center space-x-2"
                onClick={() => {
                  // Simulate photo upload
                  if (formData.uploadedPhotos.length < 6) {
                    setFormData(prev => ({
                      ...prev,
                      uploadedPhotos: [...prev.uploadedPhotos, `photo-${Date.now()}`]
                    }));
                  }
                }}
              >
                <Upload size={20} />
                <span>Upload from Gallery</span>
              </button>
            </div>
          </div>
        );

      case 'Contacts':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Share Contacts</h1>
              <p className="text-subtext">Help us suggest friends who might be interested</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-blue-500" size={24} />
                    <div>
                      <span className="text-body font-medium">Share contacts</span>
                      <p className="text-subtext text-sm">Find friends already on ConnectSphere</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.shareContacts}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, shareContacts: checked }))}
                  />
                </div>
                
                <div className="text-subtext text-sm">
                  We'll only use this to suggest mutual connections and won't store your contacts permanently.
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h3 className="text-body font-medium text-blue-900">Privacy Protected</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Your contacts are encrypted and only used for friend suggestions. You can disable this anytime in settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <MapPin className="text-red-500" size={32} />
              </div>
              <h1 className="text-section-header gradient-text mb-2">Share your location to get started!</h1>
              <p className="text-subtext font-medium">Your location is safe with us - we never show your exact location to others</p>
            </div>

            <div className="space-y-4">
              {!formData.allowLocation && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                  <div className="text-red-600 font-bold text-lg mb-2">⚠️ Location Required</div>
                  <p className="text-red-700 text-sm">
                    Without location access, we cannot show you nearby activities, events, or connect you with people in your area. This is the core functionality of our app.
                  </p>
                </div>
              )}

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-blue-500" size={24} />
                    <div>
                      <span className="text-body font-medium">Allow location access</span>
                      <p className="text-subtext text-sm">Essential for finding nearby activities and people</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.allowLocation}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, allowLocation: checked }))}
                    className={`${!formData.allowLocation ? 'data-[state=unchecked]:bg-gray-300' : ''}`}
                  />
                </div>
                
                <div className="text-subtext text-sm">
                  🔒 Your privacy matters: We only show approximate distance to others, never your exact location. Your safety is our priority.
                </div>
              </div>




            </div>
          </div>
        );

      case 'Colleagues':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Avoid colleagues or acquaintances?</h1>
              <p className="text-subtext">Keep work and personal activities separate</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-blue-500" size={24} />
                    <div>
                      <span className="text-body font-medium">Avoid colleagues</span>
                      <p className="text-subtext text-sm">Hide from people in your professional network</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.avoidColleagues}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, avoidColleagues: checked }))}
                    className={`${!formData.avoidColleagues ? 'data-[state=unchecked]:bg-gray-300' : ''}`}
                  />
                </div>
                
                <div className="text-subtext text-sm">
                  We use email domains and contact matching to identify potential colleagues.
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="text-purple-500" size={24} />
                    <div>
                      <span className="text-body font-medium">Avoid close friends & family</span>
                      <p className="text-subtext text-sm">Keep some activities separate from personal circle</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.avoidFriendsFamily || false}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, avoidFriendsFamily: checked }))}
                    className={`${!(formData.avoidFriendsFamily || false) ? 'data-[state=unchecked]:bg-gray-300' : ''}`}
                  />
                </div>
                
                <div className="text-subtext text-sm">
                  Sometimes you want to try new activities without family or close friends knowing.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <Heart className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h3 className="text-body font-medium text-blue-900">Personal Space</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Keep your leisure activities private from connections
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <Users className="text-purple-600 mt-1" size={20} />
                    <div>
                      <h3 className="text-body font-medium text-purple-900">Professional Balance</h3>
                      <p className="text-purple-700 text-sm mt-1">
                        Meet new people outside your professional circle
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!formData.avoidColleagues && (
                <div className="text-center text-subtext">
                  You can always change this setting later in Privacy preferences
                </div>
              )}
            </div>
          </div>
        );

      case 'Activity Preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">Activity Preferences</h1>
              <p className="text-subtext">Feel free to select multiple activities (max 5)</p>
              <p className="text-subtext">
                {formData.selectedActivities.length}/5 selected
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <ChoiceButton
                  key={activity}
                  selected={formData.selectedActivities.includes(activity)}
                  disabled={formData.selectedActivities.length >= 5 && !formData.selectedActivities.includes(activity)}
                  onClick={() => {
                    if (formData.selectedActivities.includes(activity)) {
                      toggleSelection(activity, 'selectedActivities');
                    } else if (formData.selectedActivities.length < 5) {
                      toggleSelection(activity, 'selectedActivities');
                    }
                  }}
                  className="text-sm px-3 py-2"
                >
                  {activity}
                </ChoiceButton>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.customActivity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 30) {
                    setFormData(prev => ({ ...prev, customActivity: value }));
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && formData.customActivity && formData.selectedActivities.length < 5) {
                    setFormData(prev => ({
                      ...prev,
                      selectedActivities: [...prev.selectedActivities, formData.customActivity],
                      customActivity: ''
                    }));
                  }
                }}
                placeholder="Custom activity"
                maxLength={30}
              />
              <ChoiceButton
                variant="compact"
                disabled={formData.selectedActivities.length >= 5 || !formData.customActivity.trim()}
                onClick={() => {
                  if (formData.customActivity && formData.selectedActivities.length < 5) {
                    setFormData(prev => ({
                      ...prev,
                      selectedActivities: [...prev.selectedActivities, formData.customActivity],
                      customActivity: ''
                    }));
                  }
                }}
                className={`w-12 h-12 transition-all duration-200 ${
                  formData.customActivity.trim() && formData.selectedActivities.length < 5
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105'
                    : ''
                }`}
              >
                <Plus size={16} />
              </ChoiceButton>
            </div>

            {/* Character counter */}
            <p className="text-xs text-gray-500 text-right">{formData.customActivity.length}/30 characters</p>

            {/* Activity suggestions */}
            {formData.customActivity.length > 0 && (
              <div className="glass-card p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {activities
                    .filter(activity => 
                      activity.toLowerCase().includes(formData.customActivity.toLowerCase()) &&
                      !formData.selectedActivities.includes(activity)
                    )
                    .slice(0, 3)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          if (formData.selectedActivities.length < 5) {
                            setFormData(prev => ({
                              ...prev,
                              selectedActivities: [...prev.selectedActivities, suggestion],
                              customActivity: ''
                            }));
                          }
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {formData.selectedActivities.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-body font-semibold mb-3 text-white">Your selections:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedActivities.map((activity) => (
                    <Badge
                      key={activity}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-tag flex items-center gap-1 px-3 py-1.5 rounded-full"
                    >
                      <span className="text-white">{activity}</span>
                      <button
                        className="ml-1 text-white hover:text-gray-200"
                        onClick={() => toggleSelection(activity, 'selectedActivities')}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'Goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">What brings you here?</h1>
              <p className="text-body">Select up to 3 that apply</p>
              <p className="text-body">
                {formData.goals.length}/3 selected
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {goals.map((goal) => (
                <ChoiceButton
                  key={goal.id}
                  selected={formData.goals.includes(goal.id)}
                  disabled={!formData.goals.includes(goal.id) && formData.goals.length >= 3}
                  onClick={() => toggleSelection(goal.id, 'goals')}
                  className="text-base px-4 py-3 flex items-center"
                >
                  <span className="mr-2 text-lg">{goal.icon}</span>
                  {goal.label}
                </ChoiceButton>
              ))}
            </div>
          </div>
        );

      case 'About You':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">About you</h1>
              <p className="text-subtext">Help others get to know you better</p>
            </div>

            <div className="space-y-6">
              {/* Personality Traits */}
              <div>
                <h3 className="text-body font-semibold mb-3">Your personality (max 3)</h3>
                <div className="flex flex-wrap gap-2">
                  {personalityTraits.map((trait) => (
                    <ChoiceButton
                      key={trait}
                      selected={formData.personalityTraits.includes(trait)}
                      disabled={!formData.personalityTraits.includes(trait) && formData.personalityTraits.length >= 3}
                      onClick={() => toggleSelection(trait, 'personalityTraits')}
                      className="text-sm px-3 py-2"
                    >
                      {trait}
                    </ChoiceButton>
                  ))}
                </div>
                <p className="text-subtext text-sm mt-2">
                  {formData.personalityTraits.length}/3 selected
                </p>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-body font-semibold mb-3">How active are you?</h3>
                <div className="flex flex-wrap gap-2">
                  {activityLevels.map((level) => (
                    <ChoiceButton
                      key={level}
                      selected={formData.activityLevel === level}
                      onClick={() => setFormData(prev => ({ ...prev, activityLevel: level }))}
                      className="text-sm px-3 py-2"
                    >
                      {level}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              {/* Vibe Preference */}
              <div>
                <h3 className="text-body font-semibold mb-3">Your vibe</h3>
                <div className="flex flex-wrap gap-2">
                  {vibePreferences.map((vibe) => (
                    <ChoiceButton
                      key={vibe}
                      selected={formData.vibePreference === vibe}
                      onClick={() => setFormData(prev => ({ ...prev, vibePreference: vibe }))}
                      className="text-sm px-3 py-2"
                    >
                      {vibe}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              {/* Punctuality */}
              <div>
                <h3 className="text-body font-semibold mb-3">Punctuality</h3>
                <div className="flex flex-wrap gap-2">
                  {punctualityLevels.map((level) => (
                    <ChoiceButton
                      key={level}
                      selected={formData.punctuality === level}
                      onClick={() => setFormData(prev => ({ ...prev, punctuality: level }))}
                      className="text-sm px-3 py-2"
                    >
                      {level}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Availability':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-section-header gradient-text mb-2">When are you free?</h1>
              <p className="text-subtext">Select your preferred times</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-body font-semibold mb-3">Days of the week</h3>
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <ChoiceButton
                      key={day}
                      selected={formData.availableDays.includes(day)}
                      onClick={() => toggleSelection(day, 'availableDays')}
                      className="text-sm px-2 py-2 min-w-[70px] flex justify-center"
                    >
                      {day.slice(0, 3)}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-body font-semibold mb-3">Time preferences</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <ChoiceButton
                      key={slot.id}
                      selected={formData.availableTimes.includes(slot.id)}
                      onClick={() => toggleSelection(slot.id, 'availableTimes')}
                      className="flex flex-col items-center p-4 rounded-2xl"
                    >
                      <span className="text-lg mb-1">{slot.icon}</span>
                      <span className="font-medium">{slot.label}</span>
                      <span className="text-xs opacity-75">{slot.time}</span>
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 text-body focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.customTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, customTime: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && formData.customTime) {
                      setFormData(prev => ({
                        ...prev,
                        availableTimes: [...prev.availableTimes, formData.customTime],
                        customTime: ''
                      }));
                    }
                  }}
                  placeholder="Custom time preference"
                />
                <ChoiceButton
                  variant="compact"
                  onClick={() => {
                    if (formData.customTime) {
                      setFormData(prev => ({
                        ...prev,
                        availableTimes: [...prev.availableTimes, formData.customTime],
                        customTime: ''
                      }));
                    }
                  }}
                  className="w-12 h-12"
                >
                  <Plus size={16} />
                </ChoiceButton>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h1 className="text-section-header gradient-text mb-4">Coming Soon</h1>
            <p className="text-body">This step is being developed...</p>
          </div>
        );
    }
  };

  // Main render
  switch (currentFlow) {
    case 'landing':
      return renderLandingScreen();
    case 'auth':
      return renderAuthScreen();
    case 'verification':
      return renderVerificationScreen();
    case 'profile':
      return renderProfileScreen();
    case 'complete':
      return (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 px-6 relative overflow-hidden">
          {/* Show celebration only for signup, simple welcome for login */}
          {authMode === 'signup' ? (
            <>
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 50 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      x: Math.random() * 400,
                      y: -20,
                      scale: 0
                    }}
                    animate={{
                      x: Math.random() * 400,
                      y: 800,
                      scale: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 3,
                      ease: "easeOut",
                      repeat: 3,
                      repeatDelay: Math.random() * 2
                    }}
                  >
                    <div
                      className="w-3 h-3 opacity-90"
                      style={{
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'][Math.floor(Math.random() * 8)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Balloons */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={`balloon-${i}`}
                    className="absolute text-4xl"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                  >
                    {['🎈', '🎊', '🌟', '✨', '🎉'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>

              {/* Celebration Icon */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center text-8xl mb-8 shadow-2xl relative">
                🎉
                <div className="absolute -top-4 -right-4 text-4xl">
                  ✨
                </div>
                <div className="absolute -bottom-4 -left-4 text-4xl">
                  🌟
                </div>
              </div>

              {/* Celebration Text */}
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                  HURRAH! 🎊
                </h1>
                <h2 className="text-2xl font-semibold gradient-text mb-2">Welcome to ConnectSphere!</h2>
                <p className="text-lg text-gray-600 max-w-sm">
                  Ready to connect! 🚀
                </p>
              </div>

              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white font-bold rounded-full px-10 py-5 text-xl hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse"
              >
                Start Your Adventure! 🚀
              </button>
            </>
          ) : (
            <>
              {/* Simple login success */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-6xl mb-8 shadow-2xl">
                👋
              </div>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 gradient-text">
                  Welcome Back!
                </h1>
                <p className="text-lg text-gray-600 max-w-sm">
                  Successfully logged in to ConnectSphere
                </p>
              </div>

              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full px-10 py-4 text-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Continue to Home
              </button>
            </>
          )}
        </div>
      );
    default:
      return renderWelcomeScreen();
  }

  // Welcome Popup Overlay
  if (showWelcome) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-6">
        {/* Avatar with initial */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-12">
          <span className="text-4xl font-bold text-blue-500">
            {formData.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="text-center max-w-sm mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2c3e50' }}>
            Welcome, {formData.firstName}!
          </h1>
          <p className="text-xl text-blue-500 font-medium">
            Let's go
          </p>
        </div>
        
        <button
          className="text-gray-600 hover:text-gray-800 font-medium mb-16"
          onClick={() => {
            // Allow editing name - go back to first name step
            setShowWelcome(false);
          }}
        >
          ✏️ Edit name
        </button>
        
        <button
          onClick={() => {
            setShowWelcome(false);
            setCurrentStep(currentStep + 1);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full px-8 py-4 text-lg shadow-lg hover:scale-105 transition-all duration-200"
        >
          Continue
        </button>
      </div>
    );
  }

  // Fallback welcome screen renderer (used as default case)
  function renderWelcomeScreen() {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to ConnectSphere</h1>
          <p className="text-subtext mb-6">Let's get you set up. Tap Continue to start onboarding.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setCurrentFlow('landing')}
              className="px-6 py-3 bg-white rounded-full shadow"
            >
              Back to Intro
            </button>
            <button
              onClick={() => setCurrentFlow('auth')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Account Created Popup Overlay
  if (showAccountCreated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)' }}>
        {/* Green checkmark in top right */}
        <div className="absolute top-8 right-8">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <Check className="text-white" size={24} />
          </div>
        </div>
        
        {/* Main avatar */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-12 shadow-2xl">
          <User className="text-white" size={48} />
        </div>
        
        {/* Title and subtitle */}
        <div className="text-center max-w-sm mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1e293b' }}>
            Account Created!
          </h1>
          <p className="text-lg" style={{ color: '#64748b' }}>
            You can now log in and explore your account
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-2 mb-12">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        
        {/* Continue button */}
        <button
          onClick={() => {
            setShowAccountCreated(false);
            setCurrentFlow('profile');
            setCurrentStep(0);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full px-8 py-3 text-lg shadow-xl hover:scale-105 transition-all duration-200"
        >
          Continue
        </button>
      </div>
    );
  }
}