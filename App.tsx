import { useState } from 'react';
import { Navigation } from './src/components/Navigation';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { Messages } from './components/Messages';
import { Calendar } from './components/Calendar';
import { Groups } from './components/Groups';
import { ProfileNew } from './components/ProfileNew';
import { Settings } from './components/SettingsTemp';
import { Notifications } from './components/Notifications';
import { Onboarding } from './components/OnboardingNew';
import { Toaster } from './src/components/ui/sonner';
import { InviteFloatingAction } from './components/InviteFloatingAction';
import CreateActivityModal from './components/CreateActivityModal';
import CreateGroupEventModal from './components/CreateGroupEventModal';
import CreateEventChooserModal from './components/CreateEventChooserModal';
import CreatePairingModal from './components/CreatePairingModal';
import EventCreatedModal from './components/EventCreatedModal';
import PairingCreatedModal from './components/PairingCreatedModal';
import { CalendarEventsProvider } from './src/context/calendar-events-context';
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
    // Reset app state to go back to onboarding
    setShowOnboarding(true);
    setActiveTab('home');
    setIsCreateGroupEventModalOpen(false);
    setIsCreateEventChooserOpen(false);
    setIsCreatePairingModalOpen(false);
    setIsEventCreatedModalOpen(false);
    setIsPairingCreatedModalOpen(false);
    // Show confirmation toast
    toast.success('Signed out successfully', {
      description: 'You have been signed out of ConnectSphere',
    });
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
    // Close the create modal first
    setIsCreatePairingModalOpen(false);
    
    // Store the pairing data and show the success modal
    setCreatedPairingData(pairingData);
    setIsPairingCreatedModalOpen(true);
    
    toast.success('1:1 Pairing request created!', {
      description: `Looking for ${pairingData.activity} partner`,
    });
    console.log('Created pairing:', pairingData);
  };

  const handleCreateEventModal = (activityData: any) => {
    // Close the create modal first
    setIsCreateEventModalOpen(false);
    
    // Enhance the event data with additional fields
    const enhancedEventData = {
      ...activityData,
      isPrivate: Math.random() > 0.5, // Random for demo
      creator: 'You', // Could be dynamic based on user
    };
    
    // Store the event data and show the success modal
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    
    toast.success('Event created successfully!', {
      description: `${activityData.eventName} has been scheduled for ${activityData.date}`,
    });
    console.log('Created event:', enhancedEventData);
  };

  const handleCreateGroupEvent = (eventData: any) => {
    // Close the create modal first
    setIsCreateGroupEventModalOpen(false);
    
    // Enhance the event data with additional fields
    const enhancedEventData = {
      ...eventData,
      isPrivate: eventData.visibility === 'private',
      creator: 'You', // Could be dynamic based on user
    };
    
    // Store the event data and show the success modal
    setCreatedEventData(enhancedEventData);
    setIsEventCreatedModalOpen(true);
    
    toast.success('Group event created successfully!', {
      description: `${eventData.eventName} has been scheduled for ${eventData.date}`,
    });
    console.log('Created group event:', enhancedEventData);
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
        return <Calendar 
          onNavigate={setActiveTab} 
          onCreateEvent={handleCreateEvent}
          onCreatePairing={handleChoosePairing}
          onCreateGroup={handleChooseGroup}
        />;
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
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Invite Floating Action */}
        <InviteFloatingAction onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />

        {/* Create Event Chooser Modal */}
        <CreateEventChooserModal
          isOpen={isCreateEventChooserOpen}
          onClose={() => setIsCreateEventChooserOpen(false)}
          onChoosePairing={handleChoosePairing}
          onChooseGroup={handleChooseGroup}
        />

        {/* Create Event Modal */}
        <CreateActivityModal
          isOpen={isCreateEventModalOpen}
          onClose={() => setIsCreateEventModalOpen(false)}
          onCreateActivity={handleCreateEventModal}
        />

        {/* Create Group Event Modal */}
        <CreateGroupEventModal
          isOpen={isCreateGroupEventModalOpen}
          onClose={() => setIsCreateGroupEventModalOpen(false)}
          onCreateEvent={handleCreateGroupEvent}
        />

        {/* Create Pairing Modal */}
        <CreatePairingModal
          isOpen={isCreatePairingModalOpen}
          onClose={() => setIsCreatePairingModalOpen(false)}
          onCreatePairing={handleCreatePairing}
        />

        {/* Event Created Modal */}
        <EventCreatedModal
          isOpen={isEventCreatedModalOpen}
          onClose={() => setIsEventCreatedModalOpen(false)}
          onNavigate={setActiveTab}
          eventData={createdEventData}
        />

        {/* Pairing Created Modal */}
        <PairingCreatedModal
          isOpen={isPairingCreatedModalOpen}
          onClose={() => setIsPairingCreatedModalOpen(false)}
          onNavigate={setActiveTab}
          pairingData={createdPairingData}
        />

        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </CalendarEventsProvider>
  );
}
