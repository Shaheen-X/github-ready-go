import React, { useState } from "react";
import Navbar from "./Navbar";
import ActivityCard from "./ActivityCard";
import ActivityFilter from "./ActivityFilter";
import ActivityDetailsModal from "./ActivityDetailsModal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search as SearchIcon, Filter, Users, MapPin } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./ui/pagination";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "./ui/tabs";

const activities = [
  {
    user: {
      name: "Emma Lindqvist",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=150&h=150&fit=crop&crop=face",
      location: "Kista, Stockholm, SE",
      distance: "0.8 km away",
      age: 28,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Running",
      title: "Morning Jog Buddy Needed",
      time: "Mon/Wed/Fri 06:30-07:30",
      hasRepeat: true,
      details: "Looking for someone to join my morning runs through Gamla Stan. I usually do 5-8 km at a moderate pace. Perfect way to start the day!"
    }
  },
  {
    user: {
      name: "Mike Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      location: "Södermalm, Stockholm, SE",
      distance: "1.2 km away",
      age: 35,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Gym",
      title: "Strength Training Partner",
      time: "Mon/Wed/Fri 17:30-19:30",
      hasRepeat: true,
      details: "Looking for a spotter and someone to push me during weight training. Intermediate level, focusing on progressive overload."
    }
  },
  {
    user: {
      name: "Astrid Johansson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "Östermalm, Stockholm, SE",
      distance: "2.5 km away",
      age: 26,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Yoga",
      title: "Outdoor Yoga Sessions",
      time: "Sat/Sun 09:00-10:30",
      hasRepeat: false,
      details: "I organize small group yoga sessions by the water. All levels welcome! Bring your own mat and enjoy Stockholm's beautiful nature while improving flexibility."
    }
  },
  {
    user: {
      name: "Lars Petersson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      location: "Vasastan, Stockholm, SE",
      distance: "1.7 km away",
      age: 34,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Cycling",
      title: "Weekend Cycling Group",
      time: "Sat 07:00-10:00",
      hasRepeat: false,
      details: "Moderate-paced group ride covering 40-50 km through Stockholm archipelago. We make stops for fika and always wait for everyone. Road bikes recommended."
    }
  },
  {
    user: {
      name: "Maja Nilsson",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      location: "Norrmalm, Stockholm, SE",
      distance: "15 km away",
      age: 29,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Hiking",
      title: "Forest Hiking Adventures",
      time: "Sun 08:00-15:00",
      hasRepeat: true,
      details: "Exploring Swedish forests and lakes. Moderate difficulty trails, about 10-15 km with beautiful nature views. Perfect for allemansrätten experiences!"
    }
  },
  {
    user: {
      name: "Oskar Blomqvist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      location: "Gamla Stan, Stockholm, SE",
      distance: "0.9 km away",
      age: 27,
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Basketball",
      title: "Pickup Basketball Games",
      time: "Tue/Thu 18:00-20:00",
      hasRepeat: true,
      details: "Regular pickup games at the sports complex. All skill levels welcome. We usually play 3v3 or 5v5 depending on turnout. Indoor courts available."
    }
  }
];

const groups = [
  {
    user: {
      name: "Stockholm Runners",
      image: "https://images.unsplash.com/photo-1546484959-f9a53db89f9b?w=200&h=200&fit=crop&crop=faces",
      location: "Djurgården, Stockholm",
      distance: "1.7 km away",
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Group Activity",
      title: "Morning Running Club",
      time: "Weekdays, 06:30 - 07:30",
      details: "Friendly runners meeting for 5-8 km morning runs at a conversational pace. All levels welcome. Route varies through Stockholm's beautiful parks."
    }
  },
  {
    user: {
      name: "Yoga i Parken",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&h=200&fit=crop&crop=faces",
      location: "Rålambshovsparken, Stockholm",
      distance: "2.5 km away",
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Group Activity",
      title: "Outdoor Yoga Sessions",
      time: "Weekends, 09:00 - 10:30",
      details: "Relaxed, beginner-friendly yoga with views of Riddarfjärden. Bring your mat and water. Group size 8-12. Weather permitting."
    }
  },
  {
    user: {
      name: "Stockholm Cyklister",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22a4b0bb?w=200&h=200&fit=crop&crop=faces",
      location: "Stureplan, Stockholm",
      distance: "1.3 km away",
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Group Activity",
      title: "Weekend Cycling Adventures",
      time: "Saturdays, 07:00 - 12:00",
      details: "Moderate-paced 40-60 km ride through Stockholm archipelago with fika stops. Road bikes recommended. No-drop policy."
    }
  },
  {
    user: {
      name: "Basketball Stockholm",
      image: "https://images.unsplash.com/photo-1521417531059-74247bdfb7a9?w=200&h=200&fit=crop&crop=faces",
      location: "Globen Sports Center, Stockholm",
      distance: "3.2 km away",
      city: "Stockholm",
      county: "Stockholm",
      countryCode: "SE"
    },
    activity: {
      type: "Group Activity",
      title: "Indoor Basketball League",
      time: "Tues & Thurs, 18:00 - 20:00",
      details: "Casual 3v3 and 5v5 games in heated indoor courts. All skill levels welcome. Changing rooms and shower facilities available."
    }
  }
];

const places = [
  {
    user: {
      name: "Stadion Athletics Track",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=200",
      location: "Östermalm, Stockholm",
      distance: "0.8 km away",
      openingHours: "Mon-Sun 06:00 - 22:00",
      rating: 4.6,
      ratingCount: 214,
      phone: "+46 8 555 123 45"
    },
    activity: {
      type: "Running Track",
      title: "Historic Olympic Stadium Track",
      time: "Open daily, 06:00 - 22:00",
      details: "400m professional track where 1912 Olympics were held. Water fountains and changing rooms available. Well-lit for evening runs.",
      bookingType: 'book' as const
    }
  },
  {
    user: {
      name: "SATS City",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200",
      location: "Drottninggatan 88, Stockholm",
      distance: "2.3 km away",
      openingHours: "Mon-Fri 05:00 - 23:00",
      rating: 4.4,
      ratingCount: 389,
      phone: "+46 8 555 678 90"
    },
    activity: {
      type: "Gym",
      title: "Premium Fitness Center",
      time: "Open daily",
      details: "Full-service gym with free weights, machines, group classes, and Swedish sauna. Pool and spa facilities included.",
      bookingType: 'membership' as const
    }
  },
  {
    user: {
      name: "Zinkensdamm Basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=200",
      location: "Zinkensdamm IP, Stockholm",
      distance: "1.2 km away",
      openingHours: "Mon-Sun 07:00 - 21:00",
      rating: 4.2,
      ratingCount: 96,
      phone: "+46 8 555 234 56"
    },
    activity: {
      type: "Basketball Courts",
      title: "Public Outdoor Courts",
      time: "Open daily, 07:00 - 21:00",
      details: "Four outdoor courts with good backboards and nets. Regular pickup games on weekends. Free to use.",
      bookingType: 'book' as const
    }
  },
  {
    user: {
      name: "Stockholm Marathon",
      image: "https://images.unsplash.com/photo-1530137073521-28ee92e8dc3c?q=80&w=200",
      location: "Östermalm, Stockholm",
      distance: "City Center",
      openingHours: "Event Day: 10:00 Start",
      rating: 4.8,
      ratingCount: 1200,
      phone: "+46 8 555 345 67"
    },
    activity: {
      type: "Running Event",
      title: "Annual Stockholm Marathon",
      time: "June 1, 10:00 start",
      details: "Full marathon, half marathon, and 10K options. Scenic route through Stockholm's historic districts and archipelago views. Registration required.",
      bookingType: 'book' as const
    }
  },
  {
    user: {
      name: "Ericsson Globe",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200",
      location: "Globentorget 2, Stockholm",
      distance: "4.1 km away",
      openingHours: "Mon-Sun 08:00 - 22:00",
      rating: 4.7,
      ratingCount: 542,
      phone: "+46 8 555 456 78"
    },
    activity: {
      type: "Sports Arena",
      title: "Multi-Sport Complex",
      time: "Various event times",
      details: "World's largest spherical building hosting sports events, concerts. Ice hockey, basketball courts, and fitness facilities available for booking.",
      bookingType: 'book' as const
    }
  },
  {
    user: {
      name: "Långholmen Beach Volleyball",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=200",
      location: "Långholmen Island, Stockholm",
      distance: "2.8 km away",
      openingHours: "May-Sep 09:00 - 21:00",
      rating: 4.3,
      ratingCount: 187,
      phone: "+46 8 555 567 89"
    },
    activity: {
      type: "Beach Volleyball",
      title: "Outdoor Beach Courts",
      time: "Seasonal, 09:00 - 21:00",
      details: "Sand volleyball courts with Stockholm harbor views. Equipment rental available. Perfect for summer activities and tournaments.",
      bookingType: 'book' as const
    }
  }
];

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("partners");
  const [filteredPartners, setFilteredPartners] = useState(activities);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<{user: any, activity: any} | null>(null);
  const [isActivityDetailsModalOpen, setIsActivityDetailsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 4 : 8;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filteredPartnersList = activities.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();
      
      return searchText.includes(term.toLowerCase());
    });
    setFilteredPartners(filteredPartnersList);
    
    const filteredGroupsList = groups.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();

      return searchText.includes(term.toLowerCase());
    });
    setFilteredGroups(filteredGroupsList);
    
    const filteredPlacesList = places.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();
      
      return searchText.includes(term.toLowerCase());
    });
    setFilteredPlaces(filteredPlacesList);
    
    setCurrentPage(1);
  };

  const getCurrentItems = () => {
    if (activeTab === "partners") {
      return filteredPartners;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    if (activeTab === "groups") {
      return filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
    }

    return filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    if (activeTab === "partners") {
      return 1;
    }

    if (activeTab === "groups") {
      return Math.ceil(filteredGroups.length / itemsPerPage);
    }

    return Math.ceil(filteredPlaces.length / itemsPerPage);
  };

  const currentItems = getCurrentItems();
  const totalPages = getTotalPages();

  const getPlaceholderText = () => {
    if (activeTab === "partners") {
      return "Search for workout partners in Stockholm...";
    } else if (activeTab === "groups") {
      return "Search group activities and clubs...";
    } else {
      return "Search places, venues & events...";
    }
  };

  const handleActivityCardClick = (user: any, activity: any) => {
    setSelectedActivity({ user, activity });
    setIsActivityDetailsModalOpen(true);
  };

  const MobileFilters = () => {
    return isMobile ? (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <Filter className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="pb-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription id="sheet-description">
              Customize your search by setting distance, activity type, time preferences, and skill level.
            </SheetDescription>
          </SheetHeader>
          <ActivityFilter className="border-0 shadow-none p-0" />
        </SheetContent>
      </Sheet>
    ) : null;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-section-header gradient-text mb-6">Find Your Activity Match</h1>
        
        <Tabs defaultValue="partners" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-3 mb-4 glass-card border-white/20 rounded-xl">
            <TabsTrigger
              value="partners"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Workout Partners</span>
              <span className="inline md:hidden">Partners</span>
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Groups</span>
              <span className="inline md:hidden">Groups</span>
            </TabsTrigger>
            <TabsTrigger
              value="places"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Places & Events</span>
              <span className="inline md:hidden">Places</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder={getPlaceholderText()}
                className="pl-10 h-10 bg-input-background border border-white/20 rounded-xl backdrop-blur-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <MobileFilters />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {!isMobile && (
              <div className="lg:col-span-1 hidden lg:block">
                <ActivityFilter />
              </div>
            )}
            
            <div className="lg:col-span-3">
              {currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {currentItems.map((item, index) => (
                      <ActivityCard 
                        key={index} 
                        user={item.user}
                        activity={item.activity}
                        cardType={activeTab === 'partners' ? 'partner' :
                                 activeTab === 'groups' ? 'group' : 'place'}
                        onCardClick={(activeTab === 'partners' || activeTab === 'groups') ? 
                          () => handleActivityCardClick(item.user, item.activity) : undefined}
                      />
                    ))}
                  </div>
                  
                  {activeTab !== 'partners' && totalPages > 1 && (
                    <Pagination className="mt-6">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious size="default" onClick={() => setCurrentPage(currentPage - 1)} />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i} className={isMobile && totalPages > 3 && ![0, totalPages - 1, currentPage - 1].includes(i) ? "hidden" : undefined}>
                            <PaginationLink 
                              size="icon"
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext size="default" onClick={() => setCurrentPage(currentPage + 1)} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="glass-card p-6 text-center">
                  <h3 className="font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <ActivityDetailsModal
          isOpen={isActivityDetailsModalOpen}
          onClose={() => setIsActivityDetailsModalOpen(false)}
          user={selectedActivity.user}
          activity={selectedActivity.activity}
        />
      )}
    </div>
  );
};

export default Search;
