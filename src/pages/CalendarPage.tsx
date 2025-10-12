import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function CalendarPage() {
  const events = [
    { id: 1, title: 'Morning Run', date: 'Dec 15', time: '07:00 AM', location: 'Central Park' },
    { id: 2, title: 'Badminton Match', date: 'Dec 16', time: '07:00 PM', location: 'City Sports Hall' },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
            <CalendarIcon className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Upcoming Events</h2>
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-xs text-blue-600 font-medium">{event.date.split(' ')[0]}</span>
                  <span className="text-xl font-bold text-blue-600">{event.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.time}</p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
