import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, ChevronRight, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const nearbyActivities = [
  {
    id: 1,
    title: 'Group HIIT Session',
    time: 'Tomorrow, 5:00 PM',
    location: 'Fitness Center',
    distance: '0.8 miles away',
    participants: 8,
    maxParticipants: 12,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Photography Meetup',
    time: 'This Weekend',
    location: 'Golden Gate Bridge',
    distance: '2.3 miles away',
    participants: 15,
    maxParticipants: 20,
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Morning Tennis',
    time: 'Weekdays, 7:00 AM',
    location: 'City Tennis Club',
    distance: '1.5 miles away',
    participants: 6,
    maxParticipants: 8,
    category: 'Tennis',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'
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
        {nearbyActivities.map((activity) => (
          <div key={activity.id} className="glass-card p-4 card-hover card-enter">
            <div className="flex space-x-4">
              <div className="overflow-hidden rounded-xl flex-shrink-0">
                <ImageWithFallback
                  src={activity.image}
                  alt={activity.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-lg image-hover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body font-semibold mb-1 truncate">{activity.title}</h3>
                    <div className="flex items-center space-x-2 text-subtext mb-1">
                      <Clock size={12} />
                      <span className="text-xs">{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-subtext mb-2">
                      <MapPin size={12} />
                      <span className="text-xs">{activity.location}</span>
                      <span>•</span>
                      <span className="text-xs text-blue-600">{activity.distance}</span>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs border-0 ml-2 badge-glow">
                    {activity.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Users size={12} className="text-gray-400" />
                    <span className="text-subtext text-xs">
                      {activity.participants}/{activity.maxParticipants} joined
                    </span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 rounded-full px-4 py-1 text-xs btn-scale">
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyActivitiesBlock;