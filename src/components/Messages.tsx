import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMessagesDB } from '@/hooks/useMessagesDB';

export function Messages() {
  const navigate = useNavigate();
  const { conversations } = useMessagesDB();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.activity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Header */}
      <div className="glass-card border-b border-white/20 px-6 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-section-header font-bold gradient-text">Messages</h1>
            <p className="text-subtext text-xs mt-0.5">{conversations.length} conversations</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 border-white/40 rounded-2xl focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Search className="text-blue-600" size={40} />
            </div>
            {conversations.length === 0 ? (
              <>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No conversations yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Browse events and start chatting with people
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No results found</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Try searching with different keywords
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.eventId}
                onClick={() => navigate(`/chat/${conversation.eventId}`)}
                className="glass-card p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={conversation.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                      alt={conversation.title}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/50 shadow-sm"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{conversation.title}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    
                    {conversation.activity && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200/50"
                      >
                        {conversation.activity}
                      </Badge>
                    )}
                  </div>

                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center p-0 flex-shrink-0 shadow-lg">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}