import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { QrCode, UserSearch, Mail, Camera, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  userId?: string;
}

export function ConnectModal({ isOpen, onClose, username = 'alexmorgan' }: ConnectModalProps) {
  const [searchType, setSearchType] = useState<'qr' | 'username' | 'email'>('qr');
  const [searchValue, setSearchValue] = useState('');

  const profileUrl = `https://connectsphere.app/user/${username}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

  const handleCopyQR = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard!');
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast.error('Please enter a value to search');
      return;
    }
    
    // TODO: Implement actual search logic
    toast.success(`Searching for: ${searchValue}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-section-header gradient-text">Connect</DialogTitle>
          <DialogDescription>
            Share your profile or connect with others
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="myid" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="myid">My ID</TabsTrigger>
            <TabsTrigger value="connect">Connect with Others</TabsTrigger>
          </TabsList>

          {/* My ID Tab */}
          <TabsContent value="myid" className="space-y-4 mt-4">
            <div className="flex flex-col items-center space-y-4 py-4">
              {/* QR Code */}
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <ImageWithFallback
                  src={qrCodeUrl}
                  alt="Profile QR Code"
                  className="w-48 h-48"
                />
              </div>

              {/* Username */}
              <div className="text-center space-y-1">
                <p className="text-section-header font-semibold gradient-text">@{username}</p>
                <p className="text-subtext text-sm">{profileUrl}</p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <Button 
                  onClick={handleCopyQR} 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Profile Link
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Connect with Others Tab */}
          <TabsContent value="connect" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Connection Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={searchType === 'qr' ? 'default' : 'outline'}
                  className={`flex flex-col items-center py-6 h-auto ${
                    searchType === 'qr' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                      : 'glass-card border-white/20'
                  }`}
                  onClick={() => setSearchType('qr')}
                >
                  <QrCode className="h-6 w-6 mb-2" />
                  <span className="text-xs">QR Code</span>
                </Button>

                <Button
                  variant={searchType === 'username' ? 'default' : 'outline'}
                  className={`flex flex-col items-center py-6 h-auto ${
                    searchType === 'username' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                      : 'glass-card border-white/20'
                  }`}
                  onClick={() => setSearchType('username')}
                >
                  <UserSearch className="h-6 w-6 mb-2" />
                  <span className="text-xs">Username</span>
                </Button>

                <Button
                  variant={searchType === 'email' ? 'default' : 'outline'}
                  className={`flex flex-col items-center py-6 h-auto ${
                    searchType === 'email' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' 
                      : 'glass-card border-white/20'
                  }`}
                  onClick={() => setSearchType('email')}
                >
                  <Mail className="h-6 w-6 mb-2" />
                  <span className="text-xs">Email</span>
                </Button>
              </div>

              {/* Search Input Section */}
              <div className="space-y-4">
                {searchType === 'qr' && (
                  <div className="space-y-3">
                    <Label className="text-body font-semibold">Scan QR Code</Label>
                    <div className="glass-card p-8 rounded-2xl text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-subtext mb-4">Open your camera to scan a QR code</p>
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl"
                        onClick={() => toast.info('Camera feature coming soon!')}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Open Camera
                      </Button>
                    </div>
                  </div>
                )}

                {searchType === 'username' && (
                  <div className="space-y-3">
                    <Label className="text-body font-semibold">Search by Username</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter username..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="glass-card border-white/20 rounded-xl h-12"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl"
                      >
                        <UserSearch className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {searchType === 'email' && (
                  <div className="space-y-3">
                    <Label className="text-body font-semibold">Search by Email</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter email address..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="glass-card border-white/20 rounded-xl h-12"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
