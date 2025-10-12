import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { User, Users, ChevronRight } from 'lucide-react';

interface CreateEventChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoosePairing: () => void;
  onChooseGroup: () => void;
}

const CreateEventChooserModal: React.FC<CreateEventChooserModalProps> = ({ isOpen, onClose, onChoosePairing, onChooseGroup }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="glass-card border-0 max-w-lg max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-section-header font-semibold">What would you like to create?</DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">Choose between creating a 1:1 pairing or a group activity.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="text-subtext text-sm">Choose the option that fits your plan. You can always change your mind later.</div>

            <button
              className="w-full glass-card p-4 rounded-2xl hover:shadow-lg hover:bg-white/60 transition-all text-left"
              onClick={onChoosePairing}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-body font-semibold">1:1 Pairing</div>
                  <div className="text-subtext text-sm">Find a single partner matched by your preferences.</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button
              className="w-full glass-card p-4 rounded-2xl hover:shadow-lg hover:bg-white/60 transition-all text-left"
              onClick={onChooseGroup}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-body font-semibold">Group Activity</div>
                  <div className="text-subtext text-sm">Host an event for multiple people to join.</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>

          <div className="px-6 pb-5">
            <Button onClick={onClose} variant="outline" className="w-full rounded-full">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventChooserModal;
