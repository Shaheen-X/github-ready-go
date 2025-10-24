import React from 'react';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '@/types/calendar';

const nearbyEvents: CalendarEvent[] = [
  {
    id: 'nearby-1',
    title: 'Group HIIT Session',
    type: 'group',
    activity: 'Fitness',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '5:00 PM',
    location: 'Fitness Center',
    description: 'High-intensity interval training session for all fitness levels',
    attendees: [
      { id: 'att-1', name: 'John', status: 'accepted' },
      { id: 'att-2', name: 'Sarah', status: 'accepted' },
      { id: 'att-3', name: 'Mike', status: 'accepted' },
      { id: 'att-4', name: 'Emma', status: 'accepted' },
      { id: 'att-5', name: 'Alex', status: 'accepted' },
      { id: 'att-6', name: 'Lisa', status: 'accepted' },
      { id: 'att-7', name: 'Tom', status: 'accepted' },
      { id: 'att-8', name: 'Kate', status: 'accepted' },
    ],
    maxParticipants: 12,
    status: 'upcoming',
    tags: ['Fitness', 'HIIT'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    hostName: 'FitLife Studio'
  },
  {
    id: 'nearby-2',
    title: 'Photography Meetup',
    type: 'group',
    activity: 'Photography',
    date: new Date(Date.now() + 259200000), // 3 days from now
    time: '10:00 AM',
    location: 'Golden Gate Bridge',
    description: 'Join fellow photographers for a scenic photo walk',
    attendees: [
      { id: 'att-9', name: 'David', status: 'accepted' },
      { id: 'att-10', name: 'Rachel', status: 'accepted' },
      { id: 'att-11', name: 'Chris', status: 'accepted' },
      { id: 'att-12', name: 'Sophia', status: 'accepted' },
      { id: 'att-13', name: 'James', status: 'accepted' },
      { id: 'att-14', name: 'Olivia', status: 'accepted' },
      { id: 'att-15', name: 'Daniel', status: 'accepted' },
      { id: 'att-16', name: 'Ava', status: 'accepted' },
      { id: 'att-17', name: 'Liam', status: 'accepted' },
      { id: 'att-18', name: 'Mia', status: 'accepted' },
      { id: 'att-19', name: 'Noah', status: 'accepted' },
      { id: 'att-20', name: 'Charlotte', status: 'accepted' },
      { id: 'att-21', name: 'Ethan', status: 'accepted' },
      { id: 'att-22', name: 'Amelia', status: 'accepted' },
      { id: 'att-23', name: 'Mason', status: 'accepted' },
    ],
    maxParticipants: 20,
    status: 'upcoming',
    tags: ['Photography', 'Outdoor'],
    image: 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=400&h=300&fit=crop',
    hostName: 'SF Photo Club'
  },
  {
    id: 'nearby-3',
    title: 'Morning Tennis',
    type: 'group',
    activity: 'Tennis',
    date: new Date(Date.now() + 172800000), // 2 days from now
    time: '7:00 AM',
    location: 'City Tennis Club',
    description: 'Friendly doubles tennis for all skill levels',
    attendees: [
      { id: 'att-24', name: 'Ryan', status: 'accepted' },
      { id: 'att-25', name: 'Laura', status: 'accepted' },
      { id: 'att-26', name: 'Brian', status: 'accepted' },
      { id: 'att-27', name: 'Jessica', status: 'accepted' },
      { id: 'att-28', name: 'Kevin', status: 'accepted' },
      { id: 'att-29', name: 'Michelle', status: 'accepted' },
    ],
    maxParticipants: 8,
    status: 'upcoming',
    tags: ['Tennis', 'Sports'],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    hostName: 'Tennis Pro League'
  }
];

const NearbyActivitiesBlock: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-header gradient-text">Nearby Events</h2>
        <Button variant="ghost" size="sm" className="gradient-text">
          View all
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {nearbyEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant="compact"
            onClick={() => console.log('Event clicked:', event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyActivitiesBlock;