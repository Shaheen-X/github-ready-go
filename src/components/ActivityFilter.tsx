import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { MapPin, Clock, Users, Filter, Calendar, Zap, Target, Heart } from 'lucide-react';

interface ActivityFilterProps {
  className?: string;
  activeTab?: 'partners' | 'groups' | 'places';
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ className = "", activeTab = 'partners' }) => {
  const [distance, setDistance] = useState([10]);
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('any');
  const [selectedFrequency, setSelectedFrequency] = useState<string[]>([]);
  const [selectedGroupSize, setSelectedGroupSize] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string[]>([]);
  const [selectedCommitment, setSelectedCommitment] = useState<string[]>([]);

  const categories = [
    'Running', 'Gym', 'Yoga', 'Cycling', 'Hiking', 'Basketball',
    'Swimming', 'Tennis', 'Dancing', 'Team Sports', 'Rock Climbing', 'Boxing',
    'Football', 'Walking', 'Badminton', 'Table Tennis', 'Martial Arts', 
    'Pilates', 'CrossFit', 'Volleyball', 'Golf', 'Skating', 'Surfing'
  ];

  const timeSlots = [
    'Early Morning (5-8 AM)',
    'Morning (8-11 AM)', 
    'Midday (11 AM-2 PM)',
    'Afternoon (2-5 PM)',
    'Evening (5-8 PM)',
    'Night (8-11 PM)'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  
  const frequencies = ['1-2x/week', '3-4x/week', '5+x/week', 'Flexible'];
  
  const groupSizes = ['Small (2-5)', 'Medium (6-10)', 'Large (11-20)', 'Extra Large (20+)'];
  
  const vibes = ['Competitive', 'Casual', 'Social', 'Intense', 'Beginner-Friendly', 'Supportive'];
  
  const commitmentLevels = ['Drop-in', 'Weekly', 'Monthly', 'Long-term'];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const toggleSkillLevel = (level: string) => {
    setSelectedSkillLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleFrequency = (freq: string) => {
    setSelectedFrequency(prev => 
      prev.includes(freq) 
        ? prev.filter(f => f !== freq)
        : [...prev, freq]
    );
  };

  const toggleGroupSize = (size: string) => {
    setSelectedGroupSize(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibe(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  const toggleCommitment = (commitment: string) => {
    setSelectedCommitment(prev => 
      prev.includes(commitment) 
        ? prev.filter(c => c !== commitment)
        : [...prev, commitment]
    );
  };

  const clearAllFilters = () => {
    setDistance([10]);
    setAgeRange([18, 65]);
    setSelectedCategories([]);
    setSelectedTimes([]);
    setSelectedDays([]);
    setSelectedSkillLevels([]);
    setSelectedGender('any');
    setSelectedFrequency([]);
    setSelectedGroupSize([]);
    setSelectedVibe([]);
    setSelectedCommitment([]);
  };

  return (
    <div className={`glass-card p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6 pr-4">
          <Separator />

          {/* Distance Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Distance</Label>
            </div>
            <div className="space-y-2">
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 mile</span>
                <span className="font-medium text-blue-600">{distance[0]} miles</span>
                <span>50+ miles</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Partner-specific filters */}
          {activeTab === 'partners' && (
            <>
              {/* Age Range */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Age Range</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={ageRange}
                    onValueChange={setAgeRange}
                    max={75}
                    min={18}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>18</span>
                    <span className="font-medium text-blue-600">{ageRange[0]} - {ageRange[1]} years</span>
                    <span>75+</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Gender Preference */}
              <div className="space-y-3">
                <Label className="font-medium">Gender Preference</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Any', 'Male', 'Female'].map((gender) => (
                    <Badge
                      key={gender}
                      variant={selectedGender === gender.toLowerCase() ? "default" : "secondary"}
                      className={`cursor-pointer text-center justify-center py-2 ${
                        selectedGender === gender.toLowerCase()
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                          : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => setSelectedGender(gender.toLowerCase())}
                    >
                      {gender}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Workout Frequency */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Workout Frequency</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {frequencies.map((freq) => (
                    <Badge
                      key={freq}
                      variant={selectedFrequency.includes(freq) ? "default" : "secondary"}
                      className={`cursor-pointer text-center justify-center py-2 ${
                        selectedFrequency.includes(freq)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                          : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => toggleFrequency(freq)}
                    >
                      {freq}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Group-specific filters */}
          {activeTab === 'groups' && (
            <>
              {/* Group Size */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Group Size</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {groupSizes.map((size) => (
                    <Badge
                      key={size}
                      variant={selectedGroupSize.includes(size) ? "default" : "secondary"}
                      className={`cursor-pointer text-center justify-center py-2 ${
                        selectedGroupSize.includes(size)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                          : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => toggleGroupSize(size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Group Vibe */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Group Vibe</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {vibes.map((vibe) => (
                    <Badge
                      key={vibe}
                      variant={selectedVibe.includes(vibe) ? "default" : "secondary"}
                      className={`cursor-pointer text-center justify-center py-2 ${
                        selectedVibe.includes(vibe)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                          : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => toggleVibe(vibe)}
                    >
                      {vibe}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Commitment Level */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Commitment Level</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {commitmentLevels.map((commitment) => (
                    <Badge
                      key={commitment}
                      variant={selectedCommitment.includes(commitment) ? "default" : "secondary"}
                      className={`cursor-pointer text-center justify-center py-2 ${
                        selectedCommitment.includes(commitment)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                          : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => toggleCommitment(commitment)}
                    >
                      {commitment}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Activity Categories */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Activity Types</Label>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label 
                    htmlFor={category} 
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Availability Days */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Available Days</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => (
                <Badge
                  key={day}
                  variant={selectedDays.includes(day) ? "default" : "secondary"}
                  className={`cursor-pointer text-center justify-center py-2 ${
                    selectedDays.includes(day)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                      : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Time Preferences */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Preferred Times</Label>
            </div>
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={selectedTimes.includes(time)}
                    onCheckedChange={() => toggleTime(time)}
                  />
                  <Label 
                    htmlFor={time} 
                    className="text-sm cursor-pointer flex-1"
                  >
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Skill Level */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Skill Level</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {skillLevels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedSkillLevels.includes(level) ? "default" : "secondary"}
                  className={`cursor-pointer text-center justify-center py-2 ${
                    selectedSkillLevels.includes(level) 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg' 
                      : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => toggleSkillLevel(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Apply Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 rounded-full py-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Apply Filters
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityFilter;