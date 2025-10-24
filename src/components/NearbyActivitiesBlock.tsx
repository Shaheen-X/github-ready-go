import React, { useMemo } from 'react';
import { Button } from './ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { EventCard } from './EventCard';
import { useActivities } from '@/hooks/useActivities';
import { useNavigate } from 'react-router-dom';

interface NearbyActivitiesBlockProps {
  onNavigate?: (tab: string) => void;
}

const NearbyActivitiesBlock: React.FC<NearbyActivitiesBlockProps> = ({ onNavigate }) => {
  const { activities, loading } = useActivities();
  const navigate = useNavigate();

  // Filter to show a mix of group and 1:1 activities
  const nearbyEvents = useMemo(() => {
    if (!activities.length) return [];
    
    // Get upcoming activities only
    const now = new Date();
    const upcomingActivities = activities.filter(activity => 
      activity.date >= now
    );

    // Separate by type
    const groupActivities = upcomingActivities.filter(a => a.type === 'group');
    const oneToOneActivities = upcomingActivities.filter(a => a.type === 'one-to-one');

    // Mix them: 2 group, 1 one-to-one, 1 group, 1 one-to-one, etc.
    const mixed = [];
    let groupIndex = 0;
    let oneToOneIndex = 0;
    let useGroup = true;
    
    while (mixed.length < 6 && (groupIndex < groupActivities.length || oneToOneIndex < oneToOneActivities.length)) {
      if (useGroup && groupIndex < groupActivities.length) {
        mixed.push(groupActivities[groupIndex]);
        groupIndex++;
        // Add two groups in a row at the start
        if (mixed.length === 1 && groupIndex < groupActivities.length) {
          mixed.push(groupActivities[groupIndex]);
          groupIndex++;
        }
      } else if (!useGroup && oneToOneIndex < oneToOneActivities.length) {
        mixed.push(oneToOneActivities[oneToOneIndex]);
        oneToOneIndex++;
      } else if (groupIndex < groupActivities.length) {
        // Fallback if one type runs out
        mixed.push(groupActivities[groupIndex]);
        groupIndex++;
      } else if (oneToOneIndex < oneToOneActivities.length) {
        mixed.push(oneToOneActivities[oneToOneIndex]);
        oneToOneIndex++;
      }
      
      useGroup = !useGroup;
    }

    return mixed.slice(0, 3); // Show top 3
  }, [activities]);

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('search');
    } else {
      navigate('/');
    }
  };

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
    // TODO: Navigate to event details or open modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (nearbyEvents.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section-header gradient-text">Nearby Events</h2>
          <Button variant="ghost" size="sm" className="gradient-text" onClick={handleViewAll}>
            View all
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="glass-card p-8 text-center">
          <p className="text-subtext">No nearby events available at the moment.</p>
          <p className="text-subtext text-sm mt-2">Check back soon for new activities!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-header gradient-text">Nearby Events</h2>
        <Button variant="ghost" size="sm" className="gradient-text" onClick={handleViewAll}>
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
            onClick={() => handleEventClick(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyActivitiesBlock;