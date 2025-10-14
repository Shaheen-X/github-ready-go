import { X, MapPin, Clock, Repeat, User, MessageCircle, Users, Star, Calendar, Target, Award, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  image: string;
  location: string;
  distance: string;
  age?: number;
}

interface Activity {
  type: string;
  title: string;
  time: string;
  details: string;
  hasRepeat?: boolean;
}

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  activity: Activity;
}

export default function ActivityDetailsModal({ isOpen, onClose, user, activity }: ActivityDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="border-0 max-w-lg max-h-[95vh] p-0">
        <div className="glass-card flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">Activity Details</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">View activity details and event information.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Organizer Section */}
            <div className="flex items-center space-x-4">
              <ImageWithFallback
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Organized by</div>
                <h2 className="text-lg font-semibold text-foreground">{user.name}, {user.age}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location} • {user.distance}</span>
                </div>
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="bg-white text-black border border-gray-200 hover:bg-gray-50"
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Button>
            </div>

            {/* Activity Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500 text-white text-sm border-0 rounded-full px-4 py-2">
                  {activity.type}
                </Badge>
                {activity.hasRepeat && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Repeat className="h-4 w-4 mr-1" />
                    <span>Recurring Activity</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-foreground">{activity.title}</h3>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{activity.time}</span>
                {activity.hasRepeat && (
                  <Repeat className="h-4 w-4 ml-2" />
                )}
              </div>
            </div>

            {/* Activity Description */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                About this Activity
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.details}</p>
            </div>

            {/* Activity Requirements */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                What to Expect
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-muted-foreground">Beginner to intermediate level welcome</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-muted-foreground">Equipment not required - just bring yourself</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-muted-foreground">Great way to meet like-minded people</span>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Activity Info
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-lg text-foreground">3-5</div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground">1-2h</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground">Free</div>
                  <div className="text-xs text-muted-foreground">Cost</div>
                </div>
              </div>
            </div>

            {/* Meeting Location */}
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Meeting Point
              </h4>
              <div className="space-y-2">
                <div className="text-sm text-foreground font-medium">
                  {activity.type === 'Running' ? 'Gamla Stan Metro Station' :
                   activity.type === 'Gym' ? 'SATS Södermalm' :
                   activity.type === 'Yoga' ? 'Rålambshovsparken' :
                   activity.type === 'Cycling' ? 'Djurgården Park Entrance' :
                   activity.type === 'Hiking' ? 'Nacka Nature Reserve' :
                   'Sports Complex Main Entrance'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.location}
                </div>
                <div className="text-sm text-blue-600">
                  {user.distance}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-white/20 space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Join Activity</span>
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="flex-1 bg-white text-black border border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Ask Question</span>
              </Button>
              <Button 
                variant="outline"
                className="flex-1 bg-white text-black border border-gray-200 hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}