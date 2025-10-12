import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Home } from '../components/Home';
import { Search } from '../components/Search';
import { Messages } from '../components/Messages';
import { Calendar } from '../components/Calendar';
import { Groups } from '../components/Groups';
import { ProfileNew } from '../components/ProfileNew';
import { Settings } from '../components/SettingsTemp';
import { Notifications } from '../components/Notifications';
import { Onboarding } from '../components/OnboardingNew';
import { Toaster } from 'sonner';
import { InviteFloatingAction } from '../components/InviteFloatingAction';
import CreateActivityModal from '../components/CreateActivityModal';
import CreateGroupEventModal from '../components/CreateGroupEventModal';
import CreateEventChooserModal from '../components/CreateEventChooserModal';
import CreatePairingModal from '../components/CreatePairingModal';
import EventCreatedModal from '../components/EventCreatedModal';
import PairingCreatedModal from '../components/PairingCreatedModal';
import { CalendarEventsProvider } from '@/context/calendar-events-context';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateGroupEventModalOpen, setIsCreateGroupEventModalOpen] = useState(false);
  const [isCreateEventChooserOpen, setIsCreateEventChooserOpen] = useState(false);
  const [isCreatePairingModalOpen, setIsCreatePairingModalOpen] = useState(false);
  const [isEventCreatedModalOpen, setIsEventCreatedModalOpen] = useState(false);
  const [isPairingCreatedModalOpen, setIsPairingCreatedModalOpen] = useState(false);
  const [createdEventData, setCreatedEventData] = useState<any>(null);
  const [createdPairingData, setCreatedPairingData] = useState<any>(null);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  const handleSignOut = () => {
    setShowOnboarding(true);
    setActiveTab('home');
    toast.success('Signed out successfully');
  };

  const handleCreateEvent = () => {
    setIsCreateEventChooserOpen(true);
  };

  const handleChoosePairing = () => {
    setIsCreateEventChooserOpen(false);
    setIsCreatePairingModalOpen(true);
  };

  const handleChooseGroup = () => {
    setIsCreateEventChooserOpen(false);
    setIsCreateGroupEventModalOpen(true);
  };

  const handleCreatePairing = (pairingData: any) => {
    setIsCreatePairingModalOpen(false);
    setCreatedPairingData(pairingData);
    setIsPairingCreatedModalOpen(true);
    toast.success('1:1 Pairing request created!');
  };

  const handleCreateEventModal = (activityData: any) => {
    setIsCreateEventModalOpen(false);
    const enhancedEventData = {
      ...activityData,
      isPrivate: Math.random() > 0.5,
      creator: 'You',
    };
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    toast.success('Event created successfully!');
  };

  const handleCreateGroupEvent = (eventData: any) => {
    setIsCreateGroupEventModalOpen(false);
    const enhancedEventData = {
      ...eventData,
      isPrivate: eventData.visibility === 'private',
      creator: 'You',
    };
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    toast.success('Group event created!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'search':
        return <Search />;
      case 'messages':
        return <Messages />;
      case 'calendar':
        return <Calendar onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} onCreatePairing={handleChoosePairing} onCreateGroup={handleChooseGroup} />;
      case 'groups':
        return <Groups />;
      case 'profile':
        return <ProfileNew onNavigate={setActiveTab} />;
      case 'settings':
        return <Settings onNavigate={setActiveTab} onSignOut={handleSignOut} />;
      case 'notifications':
        return <Notifications onNavigate={setActiveTab} />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  if (showOnboarding) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <CalendarEventsProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <InviteFloatingAction onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />
        <CreateEventChooserModal isOpen={isCreateEventChooserOpen} onClose={() => setIsCreateEventChooserOpen(false)} onChoosePairing={handleChoosePairing} onChooseGroup={handleChooseGroup} />
        <CreateActivityModal isOpen={isCreateEventModalOpen} onClose={() => setIsCreateEventModalOpen(false)} onCreateActivity={handleCreateEventModal} />
        <CreateGroupEventModal isOpen={isCreateGroupEventModalOpen} onClose={() => setIsCreateGroupEventModalOpen(false)} onCreateEvent={handleCreateGroupEvent} />
        <CreatePairingModal isOpen={isCreatePairingModalOpen} onClose={() => setIsCreatePairingModalOpen(false)} onCreatePairing={handleCreatePairing} />
        <EventCreatedModal isOpen={isEventCreatedModalOpen} onClose={() => setIsEventCreatedModalOpen(false)} onNavigate={setActiveTab} eventData={createdEventData} />
        <PairingCreatedModal isOpen={isPairingCreatedModalOpen} onClose={() => setIsPairingCreatedModalOpen(false)} onNavigate={setActiveTab} pairingData={createdPairingData} />
        <Toaster position="top-center" />
      </div>
    </CalendarEventsProvider>
  );
}
