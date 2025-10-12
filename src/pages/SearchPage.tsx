import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../../components/ui/input';

export function SearchPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Discover Activities</h1>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for activities, people, or locations..."
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Morning Yoga</h3>
                  <p className="text-sm text-gray-600 mb-2">Central Park • 2.5 km away</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Yoga</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Beginner</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
