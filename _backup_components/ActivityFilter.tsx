import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { MapPin, Clock, Users, Filter } from 'lucide-react';

interface ActivityFilterProps {
  className?: string;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ className = "" }) => {
  const [distance, setDistance] = useState([10]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);

  const categories = [
    'Running', 'Gym Workout', 'Yoga', 'Cycling', 'Hiking', 'Basketball',
    'Swimming', 'Tennis', 'Dancing', 'Martial Arts', 'Rock Climbing', 'Golf'
  ];

  const timeSlots = [
    'Early Morning (5-8 AM)',
    'Morning (8-11 AM)', 
    'Midday (11 AM-2 PM)',
    'Afternoon (2-5 PM)',
    'Evening (5-8 PM)',
    'Night (8-11 PM)'
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

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

  const clearAllFilters = () => {
    setDistance([10]);
    setSelectedCategories([]);
    setSelectedTimes([]);
    setSelectedSkillLevels([]);
  };

  return (
    <div className={`glass-card p-4 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Activity Categories */}
      <div className="space-y-3">
        <Label className="font-medium">Activity Types</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
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

      {/* Time Preferences */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <Label className="font-medium">Time Preferences</Label>
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
          <Users className="h-4 w-4 text-blue-600" />
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
  );
};

export default ActivityFilter;