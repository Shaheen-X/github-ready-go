import { Toaster } from "./src/components/ui/toaster";
import { Toaster as Sonner } from "./src/components/ui/sonner";
import { TooltipProvider } from "./src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./src/pages/Index";
import { ChatPage } from "./src/pages/ChatPage";
import { MessagesPage } from "./src/pages/MessagesPage";
import NotFound from "./src/pages/NotFound";
import { CalendarEventsProvider } from "./src/context/calendar-events-context";
import { ChatProvider } from "./src/context/ChatContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CalendarEventsProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/chat/:eventId" element={<ChatPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </CalendarEventsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
