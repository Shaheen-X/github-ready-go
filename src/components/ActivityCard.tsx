import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Users, Star, Briefcase, Clock, Phone, User, MessageCircle, Repeat } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string;
  distance: string;
  age?: number;
  rating?: number;
  ratingCount?: number;
  openingHours?: string;
}

interface Activity {
  type: string;
  title: string;
  time: string;
  details: string;
  bookingType?: 'book' | 'membership';
  hasRepeat?: boolean;
}

interface ActivityCardProps {
  user: User;
  activity: Activity;
  cardType?: 'partner' | 'professional' | 'place' | 'group';
  onCardClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ user, activity, cardType = 'partner', onCardClick }) => {
  const getCardIcon = () => {
    if (cardType === 'professional') return <Briefcase className="h-4 w-4" />;
    if (cardType === 'place') return <MapPin className="h-4 w-4" />;
    if (cardType === 'group') return <Users className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getActionText = () => {
    if (cardType === 'professional') return 'Book Session';
    if (cardType === 'place') {
      return activity.bookingType === 'membership' ? 'Membership' : 'Book';
    }
    if (cardType === 'group') return 'Join Group';
    return 'Connect';
  };

  const getBadgeColor = () => {
    if (cardType === 'professional') return 'bg-gradient-to-r from-purple-500 to-purple-600';
    if (cardType === 'place') return 'bg-gradient-to-r from-green-500 to-green-600';
    if (cardType === 'group') return 'bg-gradient-to-r from-orange-500 to-amber-500';
    return 'bg-gradient-to-r from-blue-500 to-cyan-400';
  };

  // Special layout for place cards
  if (cardType === 'place') {
    return (
      <div className="glass-card overflow-hidden card-hover">
        {/* Sub-row 1: Full-width image */}
        <div className="w-full h-48 overflow-hidden">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-full h-full object-cover image-hover"
          />
        </div>

        <div className="p-4">
          {/* Sub-row 2: Name and type badge */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs border-0 badge-glow">
              {activity.type}
            </Badge>
          </div>

          {/* Sub-row 3: Location and distance */}
          <div className="mb-3">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
            <span className="text-blue-600 text-sm">{user.distance}</span>
          </div>

          {/* Sub-row 4: Availability and rating */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>{user.openingHours || activity.time}</span>
            </div>
            {user.rating && (
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                <span className="text-foreground font-medium">{user.rating}</span>
                <span className="text-muted-foreground ml-1">({user.ratingCount})</span>
              </div>
            )}
          </div>

          {/* Row 3: Action buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 flex items-center justify-center btn-scale"
            >
              <Phone className="h-4 w-4 mr-1" />
              Contact
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 btn-scale"
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Special layout for group cards
  if (cardType === 'group') {
    return (
      <div 
        className="glass-card overflow-hidden card-hover cursor-pointer card-enter"
        onClick={onCardClick}
      >
        {/* Full-width image like Places */}
        <div className="w-full h-48 overflow-hidden">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-full h-full object-cover image-hover"
          />
        </div>

        <div className="p-4">
          {/* Heading */}
          <h3 className="font-semibold text-foreground text-lg mb-2">{user.name}</h3>

          {/* Address */}
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{user.location}</span>
          </div>

          {/* Distance as activity tag on the right */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-600 text-sm font-medium">{user.distance}</span>
            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs border-0 badge-glow">
              {activity.type}
            </Badge>
          </div>

          {/* Event date/time with recurring indicator */}
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>{activity.time}</span>
            {activity.hasRepeat && (
              <Repeat className="h-4 w-4 ml-2" />
            )}
          </div>

          {/* Two lines of details */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{activity.details}</p>

          {/* Join Group button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 btn-scale"
            onClick={(e) => {
              e.stopPropagation();
              // Handle join group action
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Join Group
          </Button>
        </div>
      </div>
    );
  }

  // Special layout for partner cards
  if (cardType === 'partner') {
    return (
      <div 
        className="glass-card overflow-hidden card-hover cursor-pointer card-enter"
        onClick={onCardClick}
      >
        <div className="p-4">
          {/* Row 1: Image, Name & Age, Address, Distance + Activity Tag (all same height as profile pic) */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex-shrink-0 overflow-hidden rounded-xl">
              <ImageWithFallback
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-xl object-cover shadow-lg image-hover"
              />
            </div>
            <div className="flex flex-col justify-center h-16 flex-1 min-w-0">
              <h3 className="font-semibold text-foreground leading-tight truncate">{user.name}, {user.age}</h3>
              <div className="text-sm text-muted-foreground leading-tight truncate">{user.location}</div>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 text-xs leading-tight font-medium">{user.distance}</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs border-0 rounded-full px-3 py-1 flex-shrink-0 badge-glow">
                  {activity.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 3: Title (bigger font, 20px) */}
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-foreground">{activity.title}</h2>
          </div>

          {/* Row 4: Time with icon and optional repeat icon */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{activity.time}</span>
              {activity.hasRepeat && (
                <Repeat className="h-4 w-4 ml-1" />
              )}
            </div>
          </div>

          {/* Row 5: Description (2 lines only) */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.details}</p>
          </div>

          {/* Row 6: View Details button (stretches almost whole card) */}
          <div className="mb-3">
            <Button 
              variant="outline"
              className="w-full bg-white text-black border border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2 btn-scale"
              onClick={(e) => {
                e.stopPropagation();
                if (onCardClick) onCardClick();
              }}
            >
              <Calendar className="h-4 w-4" />
              <span>View Details</span>
            </Button>
          </div>

          {/* Row 7: Message and Connect buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="flex-1 bg-white text-black border border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2 btn-scale"
              onClick={(e) => {
                e.stopPropagation();
                // Handle message action here
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Message</span>
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 flex items-center justify-center space-x-2 btn-scale"
              onClick={(e) => {
                e.stopPropagation();
                // Handle connect action here
              }}
            >
              <Users className="h-4 w-4" />
              <span>Connect</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default layout for other card types
  return (
    <div className="glass-card overflow-hidden card-hover card-enter">
      <div className="flex p-4 space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl">
          <ImageWithFallback
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-xl object-cover shadow-lg image-hover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getCardIcon()}
                <Badge className={`${getBadgeColor()} text-white text-xs border-0 capitalize`}>
                  {cardType}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.location}</span>
                <span>•</span>
                <span className="text-blue-600">{user.distance}</span>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {activity.type}
              </Badge>
            </div>
            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.details}</p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-2 border-0 rounded-full btn-scale"
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;