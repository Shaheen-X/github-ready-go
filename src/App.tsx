import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ChatPage } from "./pages/ChatPage";
import { MessagesPage } from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";
import { CalendarEventsProvider } from "@/context/calendar-events-context";
import { ChatProvider } from "@/context/ChatContext";

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
