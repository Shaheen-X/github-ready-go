import { MessageCircle } from 'lucide-react';

export function MessagesPage() {
  const conversations = [
    { id: 1, name: 'Sarah Martinez', message: 'Great workout today!', time: '2m ago', unread: 2 },
    { id: 2, name: 'Basketball Squad', message: "Who's bringing the ball?", time: '15m ago', unread: 0 },
    { id: 3, name: 'Emma Chen', message: 'Thanks for the tennis tips! 🎾', time: '1h ago', unread: 0 },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {conv.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 truncate flex-1">{conv.message}</p>
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

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
