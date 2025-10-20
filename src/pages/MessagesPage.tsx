import { MessageCircle, Search, Plus, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/context/ChatContext';

export function MessagesPage() {
  const navigate = useNavigate();
  const { conversations } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.activity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Header */}
      <div className="glass-card border-b border-white/20 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          <Button 
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 btn-scale"
            onClick={() => navigate('/')}
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/60 border-white/40 backdrop-blur-sm focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 space-y-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv, index) => (
            <div
              key={conv.eventId}
              onClick={() => navigate(`/chat/${conv.eventId}`)}
              className="glass-card cursor-pointer hover:scale-[1.02] transition-all p-4 card-enter"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={conv.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'}
                    alt={conv.title}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/50"
                  />
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-foreground truncate pr-2">
                      {conv.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conv.time}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center gap-2">
                    {conv.activity && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200/50"
                      >
                        {conv.activity}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} />
                      <span>Group</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          // Empty state - no conversations
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="text-blue-600" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No conversations yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start by creating an event or joining one to chat with other participants
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 btn-scale"
            >
              <Calendar className="mr-2" size={18} />
              Browse Events
            </Button>
          </div>
        ) : (
          // Empty search results
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
              <Search className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No results found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Try searching for a different event or activity name
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
