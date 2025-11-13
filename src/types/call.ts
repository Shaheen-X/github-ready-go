export type CallType = 'audio' | 'video';
export type CallStatus = 'initiating' | 'connecting' | 'ringing' | 'active' | 'ended' | 'missed' | 'rejected' | 'failed';

export interface Call {
  id: string;
  eventId: string;
  type: CallType;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  participants: string[];
  initiator: string;
  isOutgoing: boolean;
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export interface ActiveCall {
  call: Call;
  participants: CallParticipant[];
  localStream?: MediaStream;
  remoteStreams: Map<string, MediaStream>;
  isLocalMuted: boolean;
  isLocalVideoEnabled: boolean;
}