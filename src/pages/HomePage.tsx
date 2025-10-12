export function HomePage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          ConnectSphere
        </h1>
        <p className="text-gray-600 mb-8">Good morning, Alex!</p>
        
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
            <p className="text-gray-600">Ready to connect with people through activities you love?</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <div className="text-xs text-gray-600">Connections</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-600">Activities</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">4.9</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  15
                </div>
                <div className="flex-1">
                  <p className="font-medium">Morning Run</p>
                  <p className="text-sm text-gray-600">07:00 AM • Central Park</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
