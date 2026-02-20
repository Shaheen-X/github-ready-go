import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/components/Home';
import { Search } from '@/components/Search';
import { Activities } from '@/components/Activities';
import { Messages } from '@/components/Messages';
import { Calendar } from '@/components/Calendar';
import { Groups } from '@/components/Groups';
import { ProfileNew } from '@/components/ProfileNew';
import { Settings } from '@/components/SettingsTemp';
import { Notifications } from '@/components/Notifications';
import { Onboarding } from '@/components/OnboardingNew';
import { InviteFloatingAction } from '@/components/InviteFloatingAction';
import CreateActivityModal from '@/components/CreateActivityModal';
import CreateGroupEventModal from '@/components/CreateGroupEventModal';
import CreateEventChooserModal from '@/components/CreateEventChooserModal';
import CreatePairingModal from '@/components/CreatePairingModal';
import EventCreatedModal from '@/components/EventCreatedModal';
import PairingCreatedModal from '@/components/PairingCreatedModal';
import { ChatPage } from '@/pages/ChatPage';
import { ProfileViewPage } from '@/pages/ProfileViewPage';
import { AuthPage } from '@/pages/AuthPage';
import { BrowseActivitiesPage } from '@/pages/BrowseActivitiesPage';
import NotFound from '@/pages/NotFound';
import { CalendarEventsProvider } from '@/context/calendar-events-context';
import { ChatProvider } from '@/context/ChatContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCalendarEventsDB } from '@/hooks/useCalendarEventsDB';
import type { NewEventInput } from '@/types/calendar';
import { toast } from 'sonner';

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateGroupEventModalOpen, setIsCreateGroupEventModalOpen] = useState(false);
  const [isCreateEventChooserOpen, setIsCreateEventChooserOpen] = useState(false);
  const [isCreatePairingModalOpen, setIsCreatePairingModalOpen] = useState(false);
  const [isEventCreatedModalOpen, setIsEventCreatedModalOpen] = useState(false);
  const [isPairingCreatedModalOpen, setIsPairingCreatedModalOpen] = useState(false);
  const [createdEventData, setCreatedEventData] = useState<any>(null);
  const [createdPairingData, setCreatedPairingData] = useState<any>(null);
  const { signOut } = useAuth();
  const { createEvent } = useCalendarEventsDB();

  const handleOnboardingComplete = () => setShowOnboarding(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully', {
      description: 'You have been signed out of ConnectSphere',
    });
  };

  const handleCreateEvent = () => setIsCreateEventChooserOpen(true);
  const handleChoosePairing = () => { setIsCreateEventChooserOpen(false); setIsCreatePairingModalOpen(true); };
  const handleChooseGroup = () => { setIsCreateEventChooserOpen(false); setIsCreateGroupEventModalOpen(true); };

  const handleCreatePairing = (pairingData: any) => {
    const attendees = (pairingData.selectedBuddies || []).map((buddy: any) => ({
      id: buddy.id,
      name: buddy.name,
      avatar: buddy.avatar,
      status: 'pending' as const
    }));

    const date: Date = pairingData.hasCustomDateTime
      ? new Date(`${pairingData.customDate}T${pairingData.customTime}`)
      : new Date();

    const time: string = pairingData.hasCustomDateTime ? pairingData.customTime : '09:00';

    const eventInput: NewEventInput = {
      title: pairingData.title,
      type: 'one-to-one',
      date,
      time,
      location: pairingData.location || '',
      description: pairingData.description || '',
      attendees,
      maxParticipants: 2,
      tags: pairingData.activity ? [pairingData.activity] : [],
    };

    createEvent(eventInput);
    setIsCreatePairingModalOpen(false);
    setCreatedPairingData(pairingData);
    setIsPairingCreatedModalOpen(true);
    toast.success('1:1 Pairing request created!', { description: `Looking for ${pairingData.activity} partner` });
  };

  const handleCreateEventModal = (activityData: any) => {
    setIsCreateEventModalOpen(false);
    const enhancedEventData = { ...activityData, isPrivate: Math.random() > 0.5, creator: 'You' };
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    toast.success('Event created successfully!', { description: `${activityData.eventName} has been scheduled for ${activityData.date}` });
  };

  const handleCreateGroupEvent = (eventData: any) => {
    const attendees = (eventData.selectedBuddies || []).map((buddy: any) => ({
      id: buddy.id,
      name: buddy.name,
      avatar: buddy.avatar,
      status: 'pending' as const
    }));

    const date = new Date(`${eventData.date}T${eventData.time}`);

    const eventInput: NewEventInput = {
      title: eventData.eventName,
      type: 'group',
      date,
      time: eventData.time,
      location: eventData.location || '',
      description: eventData.description || '',
      attendees,
      maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : 0,
      tags: eventData.activity ? [eventData.activity] : [],
      image: eventData.selectedImage || eventData.image,
    };

    createEvent(eventInput);
    setIsCreateGroupEventModalOpen(false);
    const enhancedEventData = { ...eventData, isPrivate: eventData.visibility === 'private', creator: 'You' };
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    toast.success('Group event created successfully!', { description: `${eventData.eventName} has been scheduled for ${eventData.date}` });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} />;
      case 'search': return <Search />;
      case 'activities': return <Activities />;
      case 'messages': return <Messages />;
      case 'calendar': return <Calendar onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} onCreatePairing={handleChoosePairing} onCreateGroup={handleChooseGroup} />;
      case 'connect': return <Groups />;
      case 'groups': return <Groups />;
      case 'profile': return <ProfileNew onNavigate={setActiveTab} />;
      case 'settings': return <Settings onNavigate={setActiveTab} onSignOut={handleSignOut} />;
      case 'notifications': return <Notifications onNavigate={setActiveTab} />;
      default: return <Home onNavigate={setActiveTab} />;
    }
  };

  if (showOnboarding) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster />
        <Sonner />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (no login required) */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/browse" element={<BrowseActivitiesPage />} />
      
      {/* Standalone Routes (protected) */}
      <Route path="/chat/:eventId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><ProfileViewPage /></ProtectedRoute>} />
      
      {/* Main App Route (protected) */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
            <main className="flex-1 overflow-hidden">{renderContent()}</main>
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            <InviteFloatingAction onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />

            {/* Modals */}
            <CreateEventChooserModal
              isOpen={isCreateEventChooserOpen}
              onClose={() => setIsCreateEventChooserOpen(false)}
              onChoosePairing={handleChoosePairing}
              onChooseGroup={handleChooseGroup}
            />
            <CreateActivityModal
              isOpen={isCreateEventModalOpen}
              onClose={() => setIsCreateEventModalOpen(false)}
              onCreateActivity={handleCreateEventModal}
            />
            <CreateGroupEventModal
              isOpen={isCreateGroupEventModalOpen}
              onClose={() => setIsCreateGroupEventModalOpen(false)}
              onCreateEvent={handleCreateGroupEvent}
            />
            <CreatePairingModal
              isOpen={isCreatePairingModalOpen}
              onClose={() => setIsCreatePairingModalOpen(false)}
              onCreatePairing={handleCreatePairing}
            />
            <EventCreatedModal
              isOpen={isEventCreatedModalOpen}
              onClose={() => setIsEventCreatedModalOpen(false)}
              onNavigate={setActiveTab}
              eventData={createdEventData}
            />
            <PairingCreatedModal
              isOpen={isPairingCreatedModalOpen}
              onClose={() => setIsPairingCreatedModalOpen(false)}
              pairingData={createdPairingData}
            />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CalendarEventsProvider>
              <ChatProvider>
                <AppContent />
                
                {/* Toast Notifications */}
                <Toaster />
                <Sonner />
              </ChatProvider>
            </CalendarEventsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
