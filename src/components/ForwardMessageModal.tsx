import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Conversation } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";

interface ForwardMessageModalProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onForward: (conversationId: string) => void;
  messageText: string;
}

export function ForwardMessageModal({
  open,
  onClose,
  conversations,
  onForward,
  messageText,
}: ForwardMessageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground line-clamp-3">{messageText}</p>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.eventId}
                  onClick={() => {
                    onForward(conv.eventId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex-1 text-left">
                    <p className="font-medium">{conv.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
