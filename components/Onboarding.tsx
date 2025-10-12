import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Eye, EyeOff, Check, X, MapPin, Calendar, Clock, Users, Camera, QrCode, Upload, Search, Mail, User, Phone, Shield, Heart, Target, Zap, Timer, Globe, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// Figma asset imports are not available in this environment. Use placeholders to avoid compile errors.
const exampleImageGoals = '';
const exampleImageAbout = '';
const exampleImageActivities = '';
// import { format } from 'date-fns';

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingFlow = 'welcome' | 'auth' | 'verification' | 'profile' | 'complete';
type AuthMode = 'login' | 'signup';

// Activity options for selection
const activities = [
  'Gym', 'Running', 'Team Sports', 'Dancing', 'Group Workouts', 'Archery', 
  'Skateboarding', 'Snowboarding', 'Table Tennis', 'Hockey', 'Rowing', 'Parkour',
  'Martial Arts', 'Cycling', 'Casual Sports', 'Fitness Classes', 'Outdoor Adventures',
  'Paddleboarding', 'Crossfit', 'Swimming', 'Hiking', 'Walking', 'Boxing', 'Yoga',
  'Rock Climbing', 'Golf', 'Skiing', 'Badminton', 'Tennis', 'Football', 'Bowling',
  'Concert', 'Cricket', 'Art', 'Support Group', 'Basketball', 'Painting', 'Co-Founder'
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

const timeSlots = [
  { id: 'morning', label: 'Morning', time: '6-12', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12-4', icon: '☀️' },
  { id: 'evening', label: 'Evening', time: '4-9', icon: '🌆' },
  { id: 'night', label: 'Late Night', time: '9-12', icon: '🌙' }
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
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow>('welcome');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  
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
    hasPartners: false,
    partnerEmails: [] as string[],
    partnerEmail: '',
    teamPreferences: [] as string[],
    uploadedPhotos: [] as string[],
    shareContacts: false,
    allowLocation: false
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Validation functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
    switch (currentFlow) {
      case 'auth':
        if (authMode === 'login') {
          return validateEmail(formData.email) && formData.password.length > 0;
        } else {
          return validateEmail(formData.email) && Object.values(passwordValidation).every(Boolean);
        }
      case 'verification':
        return formData.phone.length >= 7;
      default:
        return true;
    }
  }, [currentFlow, authMode, formData.email, formData.password, formData.phone, passwordValidation]);

  // Welcome screens data
  const welcomeScreens = [
    {
      title: "Find Your Activity Partners",
      subtitle: "Connect with like-minded people for sports, hobbies, and adventures",
      image: "🎯",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      title: "Join, Create, Connect",
      subtitle: "Discover events near you or create your own. The community is waiting!",
      image: "🌟",
      gradient: "from-purple-500 to-pink-400"
    }
  ];

  const [welcomeIndex, setWelcomeIndex] = useState(0);

  // Profile setup steps - memoized to prevent infinite re-renders
  const profileSteps = useMemo(() => {
    const steps = [
      'First Name',
      'Birthday', 
      'Gender',
      'Goals',
      'Personality',
      'Activities',
      'Availability',
      'Distance',
      'Partners',
      'Team Preferences',
      'Photos',
      'Contacts',
      'Location'
    ];
    
    if (!formData.hasPartners) {
      return steps.filter(step => step !== 'Partners');
    }
    return steps;
  }, [formData.hasPartners]);

  const totalSteps = profileSteps.length;

  // Progress calculation
  const getProgress = () => {
    switch (currentFlow) {
      case 'welcome':
        return ((welcomeIndex + 1) / welcomeScreens.length) * 15;
      case 'auth':
        return 20;
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
    if (currentFlow === 'welcome') {
      if (welcomeIndex < welcomeScreens.length - 1) {
        setWelcomeIndex(welcomeIndex + 1);
      } else {
        setCurrentFlow('auth');
      }
    } else if (currentFlow === 'auth') {
      if (authMode === 'signup') {
        setCurrentFlow('verification');
      } else {
        // Handle login
        setCurrentFlow('complete');
      }
    } else if (currentFlow === 'verification') {
      if (currentStep === 0) {
        setCurrentStep(1);
        setCountdown(60);
      } else {
        setCurrentFlow('profile');
        setCurrentStep(0);
      }
    } else if (currentFlow === 'profile') {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentFlow('complete');
      }
    } else if (currentFlow === 'complete') {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentFlow === 'welcome' && welcomeIndex > 0) {
      setWelcomeIndex(welcomeIndex - 1);
    } else if (currentFlow === 'auth') {
      setCurrentFlow('welcome');
      setWelcomeIndex(welcomeScreens.length - 1);
    } else if (currentFlow === 'verification') {
      if (currentStep > 0) {
        setCurrentStep(0);
      } else {
        setCurrentFlow('auth');
      }
    } else if (currentFlow === 'profile' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle functions for multi-select
  const toggleSelection = (item: string, field: keyof typeof formData) => {
    setFormData(prev => {
      const currentSelection = prev[field] as string[];
      const newSelection = currentSelection.includes(item)
        ? currentSelection.filter(i => i !== item)
        : [...currentSelection, item];
      return { ...prev, [field]: newSelection };
    });
  };

  // Generate unique username - memoized to prevent changes on every render
  const generatedUsername = useMemo(() => {
    const adjectives = ['Swift', 'Bold', 'Zen', 'Active', 'Bright', 'Sharp'];
    const nouns = ['Runner', 'Player', 'Explorer', 'Creator', 'Warrior', 'Hero'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 99) + 1;
    return `${randomAdj}${randomNoun}${randomNum}`;
  }, []); // Empty dependency array so it only generates once

  // Render welcome screens
  const renderWelcomeScreen = () => (
    <div className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Welcome Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${welcomeScreens[welcomeIndex].gradient} flex items-center justify-center text-6xl mb-8 shadow-lg`}>
          {welcomeScreens[welcomeIndex].image}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {welcomeScreens[welcomeIndex].title}
        </h1>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {welcomeScreens[welcomeIndex].subtitle}
        </p>

        {/* Dots indicator */}
        <div className="flex space-x-2 mb-8">
          {welcomeScreens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === welcomeIndex 
                  ? 'bg-blue-500 w-6' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold text-base hover:scale-105 transition-transform"
        >
          {welcomeIndex === welcomeScreens.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
        
        {welcomeIndex === welcomeScreens.length - 1 && (
          <button
            onClick={() => {
              setCurrentFlow('auth');
              setAuthMode('login');
            }}
            className="w-full text-center text-gray-600 py-2"
          >
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );

  // Render auth screens
  const renderAuthScreen = () => (
    <div className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Header */}
      <div className="p-6 pb-4">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {authMode === 'login' ? 'Welcome back' : 'Create Account'}
          </h1>
          {authMode === 'signup' && (
            <p className="text-gray-600">Join thousands of activity partners</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-white border border-gray-200 rounded-xl h-12 px-4"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl h-12 px-4 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Requirements (Signup only) */}
          {authMode === 'signup' && formData.password && (
            <div className="space-y-2 text-sm">
              <div className={`flex items-center space-x-2 ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                {passwordValidation.length ? <Check size={14} /> : <X size={14} />}
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                {passwordValidation.uppercase ? <Check size={14} /> : <X size={14} />}
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                {passwordValidation.lowercase ? <Check size={14} /> : <X size={14} />}
                <span>One lowercase letter</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
                {passwordValidation.number ? <Check size={14} /> : <X size={14} />}
                <span>One number</span>
              </div>
              {Object.values(passwordValidation).every(Boolean) && (
                <div className="text-green-600 font-medium">Strong Password ✓</div>
              )}
            </div>
          )}

          {/* Terms (Signup only) */}
          {authMode === 'signup' && validateEmail(formData.email) && (
            <p className="text-sm text-gray-500 leading-relaxed">
              By continuing, you acknowledge and agree to our{' '}
              <span className="text-blue-600 underline">Terms</span> and{' '}
              <span className="text-blue-600 underline">Privacy Policy</span>
            </p>
          )}

          {/* Login options */}
          {authMode === 'login' && (
            <div className="flex justify-between text-sm">
              <button 
                onClick={() => setAuthMode('signup')}
                className="text-blue-600"
              >
                Create account
              </button>
              <button className="text-blue-600">Forgot password?</button>
            </div>
          )}
        </div>

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">or sign in with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl h-12 hover:bg-gray-50"
            >
              <span className="mr-2">🔴</span>
              Continue with Google
            </Button>
            <Button
              variant="outline" 
              className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl h-12 hover:bg-gray-50"
            >
              <span className="mr-2">🍎</span>
              Continue with Apple
            </Button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          {authMode === 'login' ? 'Sign In' : 'Continue'}
        </Button>
        
        {authMode === 'signup' && (
          <button
            onClick={() => setAuthMode('login')}
            className="w-full text-center text-gray-600 py-2 mt-2"
          >
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );

  // Render verification screen
  const renderVerificationScreen = () => {
    if (currentStep === 0) {
      // Phone number input
      return (
        <div className="h-full flex flex-col">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Header */}
          <div className="p-6 pb-4">
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Let's make it official</h1>
              <p className="text-gray-600">We need your phone number to send you a security code</p>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl h-12 px-3 min-w-[100px]"
                >
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  className="flex-1 bg-white border border-gray-200 rounded-xl h-12 px-4"
                />
              </div>

              <button className="text-blue-600 text-sm">
                What happens if your number changes?
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <div className="p-6">
            <Button
              onClick={handleNext}
              disabled={formData.phone.length < 7}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              Send Code
            </Button>
          </div>
        </div>
      );
    } else {
      // Verification code input
      return (
        <div className="h-full flex flex-col">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Header */}
          <div className="p-6 pb-4">
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h1>
              <p className="text-gray-600">
                We sent a 6-digit code to {formData.countryCode} {formData.phone}
              </p>
            </div>

            {/* Code Input */}
            <div className="flex space-x-3 mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationInput(index, e.target.value)}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-xl text-center text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>

            {/* Countdown */}
            {countdown > 0 ? (
              <p className="text-gray-500 text-center">
                Resend code in {countdown}s
              </p>
            ) : (
              <button className="text-blue-600 text-center w-full">
                Resend code
              </button>
            )}
          </div>

          {/* Continue Button */}
          <div className="p-6">
            <Button
              onClick={handleNext}
              disabled={verificationCode.some(digit => !digit)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              Verify
            </Button>
          </div>
        </div>
      );
    }
  };

  // Render profile setup screens
  const renderProfileScreen = () => {
    const stepName = profileSteps[currentStep];
    
    return (
      <div className="h-full flex flex-col">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          {currentStep > 0 && (
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
          )}
          <span className="text-blue-600 font-medium text-sm ml-auto">
            {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">
          {renderProfileStep(stepName)}
        </div>

        {/* Navigation */}
        <div className="p-6 pt-2">
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold hover:scale-105 transition-transform"
          >
            {currentStep === totalSteps - 1 ? 'Complete Profile' : 'Continue'}
          </Button>
          <p className="text-center text-gray-500 text-sm mt-2">
            You can change preferences later in Settings
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What's your first name?</h1>
              <p className="text-gray-600">This is how it'll appear on your profile</p>
            </div>
            <Input
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="bg-white border border-gray-200 rounded-xl h-12 px-4 text-center text-lg"
            />
            {formData.firstName && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-700">Welcome, {formData.firstName}! Let's go 🎉</p>
                <button className="text-blue-600 text-sm mt-1">Edit name</button>
              </div>
            )}
          </div>
        );

      case 'Birthday':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">When's your birthday?</h1>
              <p className="text-gray-600">Only your age will be shown on your profile</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <Select 
                  value={formData.birthdayMonth} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, birthdayMonth: value }))}
                >
                  <SelectTrigger className="bg-white border border-gray-200 rounded-xl h-12">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <Select 
                  value={formData.birthdayDay} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, birthdayDay: value }))}
                >
                  <SelectTrigger className="bg-white border border-gray-200 rounded-xl h-12">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Select 
                  value={formData.birthdayYear} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, birthdayYear: value }))}
                >
                  <SelectTrigger className="bg-white border border-gray-200 rounded-xl h-12">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 80 }, (_, i) => {
                      const year = new Date().getFullYear() - 18 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'Gender':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What's your gender?</h1>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Man', 'Woman'].map(option => (
                <button
                  key={option}
                  onClick={() => setFormData(prev => ({ ...prev, gender: option, customGender: '' }))}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 border font-medium ${
                    formData.gender === option
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFormData(prev => ({ ...prev, gender: 'More options' }))}
              className={`w-full p-4 rounded-2xl text-center transition-all duration-200 border font-medium ${
                formData.gender === 'More options' || formData.customGender
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              More options
            </button>
            
            {(formData.gender === 'More options' || formData.customGender) && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {['Non-binary', 'Transgender', 'Genderfluid', 'Prefer not to say'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFormData(prev => ({ ...prev, gender: option, customGender: '' }))}
                      className={`p-3 rounded-2xl text-center transition-all duration-200 border font-medium text-sm ${
                        formData.gender === option
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Or specify your own..."
                  value={formData.customGender}
                  onChange={(e) => setFormData(prev => ({ ...prev, customGender: e.target.value, gender: 'Custom' }))}
                  className="bg-white border border-gray-200 rounded-xl h-12 px-4"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showGender"
                checked={formData.showGender}
                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, showGender: checked as boolean }))}
              />
              <label htmlFor="showGender" className="text-sm text-gray-600">
                Show my gender on profile
              </label>
            </div>
          </div>
        );

      case 'Goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What brings you here ?</h1>
              <p className="text-gray-600">Select up to 3 options</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => {
                    if (formData.goals.includes(goal.id)) {
                      toggleSelection(goal.id, 'goals');
                    } else if (formData.goals.length < 3) {
                      toggleSelection(goal.id, 'goals');
                    }
                  }}
                  disabled={!formData.goals.includes(goal.id) && formData.goals.length >= 3}
                  className={`p-4 rounded-2xl text-left transition-all duration-200 border font-medium text-sm flex items-center ${
                    formData.goals.includes(goal.id)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 disabled:opacity-50'
                  }`}
                >
                  <span className="mr-2 text-lg">{goal.icon}</span>
                  {goal.label}
                </button>
              ))}
            </div>
            {formData.goals.length > 0 && (
              <div className="text-center text-sm text-gray-600">
                {formData.goals.length}/3 selected
              </div>
            )}
          </div>
        );

      case 'Personality':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">About you</h1>
              <p className="text-gray-600">This will help us make even better connections</p>
            </div>
            
            {/* How would you describe yourself? */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌟</span>
                <h3 className="font-medium text-gray-900">How would you describe yourself?</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {personalityTraits.map(trait => (
                  <button
                    key={trait}
                    onClick={() => toggleSelection(trait, 'personalityTraits')}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 border text-sm font-medium ${
                      formData.personalityTraits.includes(trait)
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            {/* How active are you? */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏃‍♂️</span>
                <h3 className="font-medium text-gray-900">How active are you?</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activityLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, activityLevel: level })}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 border text-sm font-medium ${
                      formData.activityLevel === level
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Any specific vibe you're looking for? */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">✨</span>
                <h3 className="font-medium text-gray-900">Any specific vibe you're looking for?</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {vibePreferences.map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => setFormData({ ...formData, vibePreference: vibe })}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 border text-sm font-medium ${
                      formData.vibePreference === vibe
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* How important is punctuality to you? */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⏰</span>
                <h3 className="font-medium text-gray-900">How important is punctuality to you?</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {punctualityLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, punctuality: level })}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 border text-sm font-medium ${
                      formData.punctuality === level
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );



      case 'Activities':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Preferences</h1>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Pick Your Activities</h3>
              <p className="text-gray-600 text-sm mb-4">Feel free to select multiple activities. Max 5</p>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {activities.map(activity => (
                  <button
                    key={activity}
                    onClick={() => toggleSelection(activity, 'selectedActivities')}
                    disabled={!formData.selectedActivities.includes(activity) && formData.selectedActivities.length >= 5}
                    className={`px-4 py-2 rounded-2xl text-center transition-all duration-200 border text-sm font-medium ${
                      formData.selectedActivities.includes(activity)
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 disabled:opacity-50'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-gray-900">Can't find what you are looking for?</p>
              <p className="text-gray-600 text-sm">Write the name of the activity below</p>
              <div className="flex space-x-3">
                <Input
                  placeholder="e.g., Archery, Zumba, Martial Arts"
                  value={formData.customActivity}
                  onChange={(e) => setFormData({ ...formData, customActivity: e.target.value })}
                  className="flex-1 bg-white border border-gray-200 rounded-xl h-12 px-4"
                />
                <Button 
                  onClick={() => {
                    if (formData.customActivity && formData.selectedActivities.length < 5) {
                      toggleSelection(formData.customActivity, 'selectedActivities');
                      setFormData({ ...formData, customActivity: '' });
                    }
                  }}
                  disabled={!formData.customActivity || formData.selectedActivities.length >= 5}
                  className="bg-white border border-gray-200 text-gray-700 rounded-xl w-12 h-12 hover:bg-gray-50"
                >
                  <Plus size={20} />
                </Button>
              </div>
              
              {formData.selectedActivities.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 mb-2">Selected ({formData.selectedActivities.length}/5):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedActivities.map(activity => (
                      <span key={activity} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'Availability':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">When are you available?</h1>
              <p className="text-gray-600">Select your preferred days and times</p>
            </div>
            
            {/* Days */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Days of the week</h3>
              <div className="grid grid-cols-4 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    onClick={() => toggleSelection(day, 'availableDays')}
                    className={`p-3 rounded-xl text-center transition-all duration-200 border font-medium ${
                      formData.availableDays.includes(day)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Preferred times</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => toggleSelection(slot.id, 'availableTimes')}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border font-medium flex items-center ${
                      formData.availableTimes.includes(slot.id)
                        ? 'bg-white text-gray-900 border-gray-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-3 text-lg">{slot.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{slot.label}</div>
                      <div className="text-xs text-gray-500">{slot.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom time */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Input
                  placeholder="Custom time..."
                  value={formData.customTime}
                  onChange={(e) => setFormData({ ...formData, customTime: e.target.value })}
                  className="flex-1 bg-white border border-gray-200 rounded-xl h-12 px-4"
                />
                <Button 
                  onClick={() => {
                    if (formData.customTime) {
                      toggleSelection(formData.customTime, 'availableTimes');
                      setFormData({ ...formData, customTime: '' });
                    }
                  }}
                  disabled={!formData.customTime}
                  className="bg-white border border-gray-200 text-gray-700 rounded-xl w-12 h-12 hover:bg-gray-50"
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>

            {/* Additional availability notes */}
            <div>
              <Input
                placeholder="Any specific availability notes..."
                value={formData.customAvailability}
                onChange={(e) => setFormData({ ...formData, customAvailability: e.target.value })}
                className="bg-white border border-gray-200 rounded-xl h-12 px-4"
              />
            </div>
          </div>
        );

      case 'Distance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Preferred distance</h1>
              <p className="text-gray-600">How far are you willing to travel?</p>
            </div>
            
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={formData.preferredDistance}
                  onValueChange={(value: number[]) => setFormData({ ...formData, preferredDistance: value })}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formData.preferredDistance[0]} km</div>
                <div className="text-gray-500 text-sm">Maximum distance</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <MapPin size={16} />
                  <span className="text-sm">
                    We'll show activities within {formData.preferredDistance[0]}km of your location
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Partners':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity partners</h1>
              <p className="text-gray-600">Do you already have partners in mind?</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">I already have partner(s)</div>
                <div className="text-sm text-gray-500">You can add multiple partners</div>
              </div>
              <Switch
                checked={formData.hasPartners}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasPartners: checked })}
              />
            </div>

            {formData.hasPartners && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <Mail className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <User className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Username</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl border-0 hover:scale-105 transition-transform">
                    <QrCode className="w-6 h-6 text-white mb-2" />
                    <span className="text-sm font-medium text-white">QR</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Partner's email..."
                      value={formData.partnerEmail}
                      onChange={(e) => setFormData({ ...formData, partnerEmail: e.target.value })}
                      className="flex-1 bg-white border border-gray-200 rounded-xl h-12 px-4"
                    />
                    <Button 
                      onClick={() => {
                        if (formData.partnerEmail && validateEmail(formData.partnerEmail)) {
                          setFormData({
                            ...formData,
                            partnerEmails: [...formData.partnerEmails, formData.partnerEmail],
                            partnerEmail: ''
                          });
                        }
                      }}
                      disabled={!formData.partnerEmail || !validateEmail(formData.partnerEmail)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl w-12 h-12"
                    >
                      +
                    </Button>
                  </div>
                  
                  {formData.partnerEmails.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Added partners:</p>
                      <div className="space-y-2">
                        {formData.partnerEmails.map((email, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-700 text-sm">{email}</span>
                            <button
                              onClick={() => setFormData({
                                ...formData,
                                partnerEmails: formData.partnerEmails.filter((_, i) => i !== index)
                              })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mb-4">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-center text-gray-600 mb-4">
                    Your unique QR code: <strong>@{generatedUsername}</strong>
                  </p>
                  <p className="text-center text-gray-500 text-sm">
                    Share this with partners to connect instantly
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 'Team Preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Who would you like to team up with?</h1>
              <p className="text-gray-600">Choose your preferred teammates</p>
            </div>
            <div className="space-y-3">
              {['Men', 'Women', 'Everyone'].map(option => (
                <button
                  key={option}
                  onClick={() => toggleSelection(option, 'teamPreferences')}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 border font-medium ${
                    formData.teamPreferences.includes(option)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'Photos':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload recent photos</h1>
              <p className="text-gray-600">Add up to 6 photos that show your personality</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <button 
                  key={index}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-white hover:border-blue-400 transition-colors"
                >
                  {formData.uploadedPhotos[index] ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Camera size={20} className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Photo Tips:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Clear, recent photos</p>
                <p>• Show hobbies, sport, travel, work, casual</p>
                <p>• Smile & be yourself</p>
                <p>• Add variety (casual, active, fun)</p>
              </div>
            </div>
          </div>
        );

      case 'Contacts':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Avoid colleagues & acquaintances?</h1>
              <p className="text-gray-600">We can help you avoid people you already know</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Share contacts</div>
                <div className="text-sm text-gray-500">We'll never store raw contact data</div>
              </div>
              <Switch
                checked={formData.shareContacts}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, shareContacts: checked })}
              />
            </div>

            {formData.shareContacts && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Privacy Protection</p>
                    <p>We only use contacts to identify people you might want to avoid. Your contact data is hashed and never stored in readable format.</p>
                  </div>
                </div>
              </div>
            )}

            <button className="text-blue-600 text-sm">
              Learn more about how we protect your privacy
            </button>
          </div>
        );

      case 'Location':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Where in the world are you?</h1>
              <p className="text-gray-600">We'll help you connect with people nearby and beyond</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <MapPin className="w-16 h-16 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setFormData({ ...formData, allowLocation: true })}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl h-12 font-semibold"
              >
                <MapPin className="mr-2 w-5 h-5" />
                Allow Location Access
              </Button>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">How we use your location:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Find activities and events near you</p>
                  <p>• Connect with people in your area</p>
                  <p>• Suggest optimal meeting locations</p>
                  <p>• Never shared without your permission</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  // Render completion screen
  const renderCompleteScreen = () => (
    <div className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center mb-8 shadow-lg animate-pulse">
          <Check className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to ConnectSphere!
        </h1>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          You can now log in and explore your account. Let's find your perfect activity partners!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-2 text-green-700">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile Created Successfully</span>
          </div>
          <p className="text-green-600 text-sm mt-1">You're all set to start connecting!</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl h-12 font-semibold text-base hover:scale-105 transition-transform"
        >
          Start Exploring
        </Button>
      </div>
    </div>
  );

  // Main render logic
  switch (currentFlow) {
    case 'welcome':
      return renderWelcomeScreen();
    case 'auth':
      return renderAuthScreen();
    case 'verification':
      return renderVerificationScreen();
    case 'profile':
      return renderProfileScreen();
    case 'complete':
      return renderCompleteScreen();
    default:
      return renderWelcomeScreen();
  }
}