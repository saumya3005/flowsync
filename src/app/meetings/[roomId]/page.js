"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/api';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Check,
  Users, Loader2, Link2, Play
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function MeetingRoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [hasJoined, setHasJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [roomDataLoading, setRoomDataLoading] = useState(true);

  // ---- Fetch Room Info (No Media) ----
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.post(`/meetings/${roomId}/join`);
        if (res.data.success) {
          setMeetingTitle(res.data.data?.title || 'Meeting');
        }
      } catch (err) {
        console.error('Failed to validate room:', err);
      } finally {
        setRoomDataLoading(false);
      }
    };
    if (user) fetchRoom();
  }, [roomId, user]);

  // ---- Socket event handlers ----
  const createPeer = useCallback((socketId, stream) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit('ice-candidate', { candidate: e.candidate, to: socketId });
      }
    };

    peer.ontrack = (e) => {
      setRemoteStreams(prev => {
        const exists = prev.find(rs => rs.socketId === socketId);
        if (exists) return prev;
        return [...prev, { socketId, stream: e.streams[0] }];
      });
    };

    return peer;
  }, [socket]);

  useEffect(() => {
    if (!socket || !hasJoined) return;

    // A new user joined — we initiate the offer
    socket.on('user-joined', async ({ socketId, userName }) => {
      setParticipants(prev => [...prev, { socketId, userName }]);
      if (!localStreamRef.current) return;

      const peer = createPeer(socketId, localStreamRef.current);
      peersRef.current[socketId] = peer;

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer, to: socketId });
    });

    // We received an offer — send answer
    socket.on('offer', async ({ offer, from }) => {
      if (!localStreamRef.current) return;
      const peer = createPeer(from, localStreamRef.current);
      peersRef.current[from] = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('answer', { answer, to: from });
    });

    // We received an answer
    socket.on('answer', async ({ answer, from }) => {
      const peer = peersRef.current[from];
      if (peer) await peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // ICE candidate
    socket.on('ice-candidate', async ({ candidate, from }) => {
      const peer = peersRef.current[from];
      if (peer) {
        try { await peer.addIceCandidate(new RTCIceCandidate(candidate)); }
        catch (e) {}
      }
    });

    // User left
    socket.on('user-left', ({ socketId }) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      setRemoteStreams(prev => prev.filter(rs => rs.socketId !== socketId));
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    };
  }, [socket, createPeer, roomId, hasJoined]);

  const handleJoinClick = async () => {
    setIsJoining(true);
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      if (socket) {
        socket.emit('join-room', { roomId, userId: user._id, userName: user.name });
      }
      setHasJoined(true);
    } catch (err) {
      console.error('Failed to get media:', err);
      alert('Could not access camera/microphone. Please check permissions.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = () => {
    // Clean up peer connections
    Object.values(peersRef.current).forEach(peer => peer.close());
    peersRef.current = {};

    // Stop all tracks
    localStreamRef.current?.getTracks().forEach(t => t.stop());

    if (socket && hasJoined) socket.emit('leave-room', { roomId });

    router.push('/meetings');
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsMicOn(track.enabled); }
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsCamOn(track.enabled); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // ---- Lobby Screen ----
  if (!hasJoined) {
    return (
      <div className="fixed inset-0 bg-charcoal flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-[#1E293B] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{roomDataLoading ? 'Loading...' : meetingTitle || 'Ready to Join?'}</h1>
          <p className="text-white/60 text-sm mb-8">
            You are about to join the meeting room: <strong>{roomId}</strong>. 
            We will ask for camera and microphone permissions when you click join.
          </p>
          
          <Button 
            onClick={handleJoinClick} 
            disabled={isJoining || roomDataLoading}
            className="w-full h-12 text-lg shadow-primary/30 shadow-lg"
          >
            {isJoining ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Join Meeting</>
            )}
          </Button>
          
          <button 
            onClick={() => router.push('/meetings')}
            className="mt-4 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    );
  }

  const totalParticipants = 1 + remoteStreams.length; // self + others

  return (
    <div className="fixed inset-0 bg-charcoal flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-charcoal/80 backdrop-blur-sm border-b border-white/10">
        <div>
          <h1 className="text-white font-semibold">{meetingTitle || 'Meeting'}</h1>
          <p className="text-white/50 text-xs">Room: {roomId}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white/60 text-sm">
            <Users className="w-4 h-4" /> {totalParticipants}
          </span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium rounded-lg transition-colors"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
            {linkCopied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className={`h-full grid gap-4 ${
          totalParticipants === 1 ? 'grid-cols-1' :
          totalParticipants === 2 ? 'grid-cols-2' :
          totalParticipants <= 4 ? 'grid-cols-2 grid-rows-2' :
          'grid-cols-3'
        }`}>
          {/* Local video */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1E293B] flex items-center justify-center">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isCamOn ? 'hidden' : ''}`}
            />
            {!isCamOn && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {user?.name?.[0]?.toUpperCase() || 'Y'}
                  </span>
                </div>
                <p className="text-white/60 text-sm">Camera off</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                You {!isMicOn && '(muted)'}
              </span>
            </div>
          </div>

          {/* Remote videos */}
          {remoteStreams.map(rs => (
            <RemoteVideo key={rs.socketId} stream={rs.stream} participants={participants} socketId={rs.socketId} />
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4 py-5 bg-charcoal/80 backdrop-blur-sm border-t border-white/10">
        <ControlButton onClick={toggleMic} active={isMicOn} activeIcon={<Mic className="w-5 h-5" />} inactiveIcon={<MicOff className="w-5 h-5" />} label={isMicOn ? 'Mute' : 'Unmute'} />
        <ControlButton onClick={toggleCam} active={isCamOn} activeIcon={<Video className="w-5 h-5" />} inactiveIcon={<VideoOff className="w-5 h-5" />} label={isCamOn ? 'Stop Video' : 'Start Video'} />
        <button
          onClick={handleLeave}
          className="flex flex-col items-center gap-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs font-medium">Leave</span>
        </button>
      </div>
    </div>
  );
}

function ControlButton({ onClick, active, activeIcon, inactiveIcon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all ${
        active ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
      }`}
    >
      {active ? activeIcon : inactiveIcon}
      <span className="text-xs font-medium opacity-80">{label}</span>
    </button>
  );
}

function RemoteVideo({ stream, participants, socketId }) {
  const videoRef = useRef(null);
  const participant = participants.find(p => p.socketId === socketId);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1E293B] flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-3 left-3">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
          {participant?.userName || 'Participant'}
        </span>
      </div>
    </div>
  );
}
