import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCalendarEvents } from '@/context/calendar-events-context';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Badge } from '../../components/ui/badge';
import { format } from 'date-fns';

export function MessagesPage() {
  const navigate = useNavigate();
  const { events } = useCalendarEvents();

  // Filter events that have chat capability (you can add logic to check if there are messages)
  const eventConversations = events.map(event => ({
    id: event.id,
    title: event.title,
    lastMessage: 'Start chatting about this event',
    time: format(new Date(event.date), 'MMM d'),
    unread: 0,
    image: event.image,
    activity: event.activity,
    location: event.location,
    date: event.date
  }));

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="space-y-2">
          {eventConversations.map((conv) => (
            <div 
              key={conv.id} 
              onClick={() => navigate(`/chat/${conv.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={conv.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                    alt={conv.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <MessageCircle size={8} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate">{conv.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">{conv.lastMessage}</p>
                  <div className="flex items-center gap-2">
                    {conv.activity && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {conv.activity}
                      </Badge>
                    )}
                    {conv.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {eventConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No event chats yet</p>
            <p className="text-sm text-gray-500 mt-2">Create an event to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
}
