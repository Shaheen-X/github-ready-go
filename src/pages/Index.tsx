import { useState } from 'react';

import { Home } from '../../components/Home';
import Search from '../../components/Search';
import { Messages } from '../../components/Messages';
import { Calendar } from '../../components/Calendar';
import { ProfileNew } from '../../components/ProfileNew';
import { CalendarEventsProvider, useCalendarEvents, createEventFromInput } from '@/context/calendar-events-context';
import { Navigation } from '../../components/Navigation';
import { InviteFloatingAction } from '../../components/InviteFloatingAction';
import CreatePairingModal from '../../components/CreatePairingModal';
import CreateGroupEventModal from '../../components/CreateGroupEventModal';
import PairingCreatedModal from '../../components/PairingCreatedModal';
import EventCreatedModal from '../../components/EventCreatedModal';
import CreateEventChooserModal from '../../components/CreateEventChooserModal';
import type { EventAttendee } from '@/types/calendar';


type Tab = 'home' | 'search' | 'messages' | 'calendar' | 'profile';

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isEventChooserOpen, setIsEventChooserOpen] = useState(false);
  const [isCreatePairingOpen, setIsCreatePairingOpen] = useState(false);
  const [isCreateGroupEventOpen, setIsCreateGroupEventOpen] = useState(false);
  const [isPairingCreatedOpen, setIsPairingCreatedOpen] = useState(false);
  const [isEventCreatedOpen, setIsEventCreatedOpen] = useState(false);
  const [createdEventData, setCreatedEventData] = useState<any>(null);
  
  const { addEvents } = useCalendarEvents();

  const handleNavigate = (tab: string) => {
    if (tab === 'create') {
      setIsEventChooserOpen(true);
    } else {
      setActiveTab(tab as Tab);
    }
  };

  const handleChoosePairing = () => {
    setIsEventChooserOpen(false);
    setIsCreatePairingOpen(true);
  };

  const handleChooseGroup = () => {
    setIsEventChooserOpen(false);
    setIsCreateGroupEventOpen(true);
  };

  const handleCreatePairing = (pairingData: any) => {
    const attendees: EventAttendee[] = pairingData.invitedBuddies?.map((buddyId: string) => ({
      id: `attendee-${buddyId}`,
      name: `User ${buddyId}`,
      status: 'pending' as const
    })) || [];

    const eventDate = pairingData.hasCustomDateTime 
      ? new Date(pairingData.customDate)
      : new Date();
    
    const eventTime = pairingData.hasCustomDateTime
      ? pairingData.customTime
      : '09:00';

    const newEvent = createEventFromInput(
      {
        title: pairingData.title,
        type: 'one-to-one',
        date: eventDate,
        time: eventTime,
        location: pairingData.location,
        description: pairingData.description || '',
        attendees,
        maxParticipants: 2,
        tags: pairingData.activity ? [pairingData.activity] : [],
      },
      `pairing-${Date.now()}`
    );

    addEvents([newEvent]);
    setCreatedEventData({ ...pairingData, eventId: newEvent.id });
    setIsCreatePairingOpen(false);
    setIsPairingCreatedOpen(true);
  };

  const handleCreateGroupEvent = (eventData: any) => {
    const attendees: EventAttendee[] = eventData.invitedBuddies?.map((buddyId: string) => ({
      id: `attendee-${buddyId}`,
      name: `User ${buddyId}`,
      status: 'pending' as const
    })) || [];

    const newEvent = createEventFromInput(
      {
        title: eventData.eventName,
        type: 'group',
        date: new Date(eventData.date),
        time: eventData.time,
        location: eventData.location,
        description: eventData.description || '',
        attendees,
        maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : 0,
        tags: eventData.activity ? [eventData.activity] : [],
        image: eventData.image
      },
      `event-${Date.now()}`
    );

    addEvents([newEvent]);
    setCreatedEventData({ ...eventData, eventId: newEvent.id });
    setIsCreateGroupEventOpen(false);
    setIsEventCreatedOpen(true);
  };

  const handlePairingCreatedClose = () => {
    setIsPairingCreatedOpen(false);
    setCreatedEventData(null);
    setActiveTab('calendar');
  };

  const handleEventCreatedClose = () => {
    setIsEventCreatedOpen(false);
    setCreatedEventData(null);
    setActiveTab('calendar');
  };

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'home' && <Home onNavigate={handleNavigate} />}
          {activeTab === 'search' && <Search />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'calendar' && <Calendar onNavigate={handleNavigate} />}
          {activeTab === 'profile' && <ProfileNew />}
        </div>
        <InviteFloatingAction 
          onNavigate={handleNavigate}
          onCreateEvent={() => setIsEventChooserOpen(true)}
        />
        <Navigation activeTab={activeTab} onTabChange={handleNavigate} />
      </div>

      <CreateEventChooserModal
        isOpen={isEventChooserOpen}
        onClose={() => setIsEventChooserOpen(false)}
        onChoosePairing={handleChoosePairing}
        onChooseGroup={handleChooseGroup}
      />
      
      <CreatePairingModal
        isOpen={isCreatePairingOpen}
        onClose={() => setIsCreatePairingOpen(false)}
        onCreatePairing={handleCreatePairing}
      />
      
      <CreateGroupEventModal
        isOpen={isCreateGroupEventOpen}
        onClose={() => setIsCreateGroupEventOpen(false)}
        onCreateEvent={handleCreateGroupEvent}
      />
      
      <PairingCreatedModal
        isOpen={isPairingCreatedOpen}
        onClose={handlePairingCreatedClose}
        pairingData={createdEventData}
      />
      
      <EventCreatedModal
        isOpen={isEventCreatedOpen}
        onClose={handleEventCreatedClose}
        eventData={createdEventData}
      />
    </>
  );
};

const Index = () => (
  <CalendarEventsProvider>
    <IndexContent />
  </CalendarEventsProvider>
);

export default Index;
