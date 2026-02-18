import { useState, useCallback, useRef, useEffect } from 'react';
import { Call, CallType, CallStatus, ActiveCall, CallParticipant } from '@/types/call';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function useCalls(sendMessageCallback?: (eventId: string, text: string) => void) {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Load call history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('callHistory');
    if (savedHistory) {
      try {
        setCallHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load call history:', error);
      }
    }
  }, []);

  // Save call history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('callHistory', JSON.stringify(callHistory));
  }, [callHistory]);

  const initializeCall = useCallback(async (
    eventId: string,
    type: CallType,
    participants: string[]
  ): Promise<Call> => {
    const call: Call = {
      id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      type,
      status: 'initiating',
      startTime: new Date().toISOString(),
      participants,
      initiator: 'current-user', // In real app, this would be the actual user ID
      isOutgoing: true,
    };

    // Add to call history immediately
    setCallHistory(prev => [call, ...prev]);
    
    return call;
  }, []);

  const startCall = useCallback(async (
    eventId: string,
    type: CallType,
    participants: string[] = []
  ) => {
    try {
      // Initialize the call
      const call = await initializeCall(eventId, type, participants);
      
      // Request media permissions
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // Display local video if video call
      if (type === 'video' && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create mock participants for demo
      const callParticipants: CallParticipant[] = [
        {
          id: 'current-user',
          name: 'You',
          isConnected: true,
          isMuted: false,
          isVideoEnabled: type === 'video',
        },
        ...participants.map((id, index) => ({
          id,
          name: `User ${index + 1}`,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150&h=150&fit=crop&crop=face`,
          isConnected: false,
          isMuted: false,
          isVideoEnabled: type === 'video',
        }))
      ];

      // Set up active call
      const activeCall: ActiveCall = {
        call: { ...call, status: 'connecting' },
        participants: callParticipants,
        localStream: stream,
        remoteStreams: new Map(),
        isLocalMuted: false,
        isLocalVideoEnabled: type === 'video',
      };

      setActiveCall(activeCall);
      setIsCallModalOpen(true);

      // Update call status to ringing after a short delay
      setTimeout(() => {
        setActiveCall(prev => prev ? {
          ...prev,
          call: { ...prev.call, status: 'ringing' }
        } : null);
      }, 1000);

      // Send call notification message
      if (sendMessageCallback) {
        const callTypeText = type === 'video' ? '📹 Video call' : '📞 Audio call';
        sendMessageCallback(eventId, `${callTypeText} started`);
      }

      // Simulate call connecting after ringing
      setTimeout(() => {
        setActiveCall(prev => prev ? {
          ...prev,
          call: { ...prev.call, status: 'active' },
          participants: prev.participants.map(p => 
            p.id !== 'current-user' ? { ...p, isConnected: true } : p
          )
        } : null);
        
        toast.success(`${type === 'video' ? 'Video' : 'Audio'} call connected`);
      }, 3000);

    } catch (error) {
      console.error('Failed to start call:', error);
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Camera/microphone access denied');
      } else {
        toast.error('Failed to start call');
      }
      
      // Update call status to failed
      setCallHistory(prev => prev.map(call => 
        call.id === activeCall?.call.id 
          ? { ...call, status: 'failed', endTime: new Date().toISOString() }
          : call
      ));
    }
  }, [initializeCall]);

  const endCall = useCallback(() => {
    if (!activeCall) return;

    const endTime = new Date().toISOString();
    const startTime = new Date(activeCall.call.startTime);
    const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

    // Stop local media stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Update call in history
    setCallHistory(prev => prev.map(call => 
      call.id === activeCall.call.id 
        ? { 
            ...call, 
            status: 'ended', 
            endTime,
            duration: duration > 0 ? duration : undefined
          }
        : call
    ));

    // Send call end notification message
    if (sendMessageCallback && duration > 0) {
      const callTypeText = activeCall.call.type === 'video' ? '📹 Video call' : '📞 Audio call';
      const durationText = formatCallDuration(duration);
      sendMessageCallback(activeCall.call.eventId, `${callTypeText} ended • ${durationText}`);
    }

    setActiveCall(null);
    setIsCallModalOpen(false);
    
    toast.success('Call ended');
  }, [activeCall]);

  const toggleMute = useCallback(() => {
    if (!activeCall || !localStreamRef.current) return;

    const audioTracks = localStreamRef.current.getAudioTracks();
    const newMutedState = !activeCall.isLocalMuted;
    
    audioTracks.forEach(track => {
      track.enabled = !newMutedState;
    });

    setActiveCall(prev => prev ? {
      ...prev,
      isLocalMuted: newMutedState,
      participants: prev.participants.map(p =>
        p.id === 'current-user' ? { ...p, isMuted: newMutedState } : p
      )
    } : null);
  }, [activeCall]);

  const toggleVideo = useCallback(() => {
    if (!activeCall || activeCall.call.type !== 'video' || !localStreamRef.current) return;

    const videoTracks = localStreamRef.current.getVideoTracks();
    const newVideoState = !activeCall.isLocalVideoEnabled;
    
    videoTracks.forEach(track => {
      track.enabled = newVideoState;
    });

    setActiveCall(prev => prev ? {
      ...prev,
      isLocalVideoEnabled: newVideoState,
      participants: prev.participants.map(p =>
        p.id === 'current-user' ? { ...p, isVideoEnabled: newVideoState } : p
      )
    } : null);
  }, [activeCall]);

  const formatCallDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getCallStatusText = useCallback((status: CallStatus): string => {
    switch (status) {
      case 'initiating': return 'Starting call...';
      case 'connecting': return 'Connecting...';
      case 'ringing': return 'Ringing...';
      case 'active': return 'Connected';
      case 'ended': return 'Call ended';
      case 'missed': return 'Missed call';
      case 'rejected': return 'Call rejected';
      case 'failed': return 'Call failed';
      default: return 'Unknown';
    }
  }, []);

  const formatCallTime = useCallback((timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const callDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (callDate.getTime() === today.getTime()) {
        return format(date, 'HH:mm');
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (callDate.getTime() === yesterday.getTime()) {
          return `Yesterday ${format(date, 'HH:mm')}`;
        } else {
          return format(date, 'MMM d, HH:mm');
        }
      }
    } catch {
      return 'Unknown time';
    }
  }, []);

  return {
    // State
    activeCall,
    callHistory,
    isCallModalOpen,
    
    // Actions
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    setIsCallModalOpen,
    
    // Refs for video elements
    localVideoRef,
    remoteVideoRef,
    
    // Utilities
    formatCallDuration,
    getCallStatusText,
    formatCallTime,
  };
}