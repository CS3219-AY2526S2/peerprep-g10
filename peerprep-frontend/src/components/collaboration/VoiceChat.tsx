"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

type VoiceChatProps = {
  socket: Socket;
  roomId: string;
  userId: string;
};

const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VoiceChat({ socket, roomId, userId }: VoiceChatProps) {
  const [hasLocalAudio, setHasLocalAudio] = useState(false);
  const [hasConnection, setHasConnection] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const [callActive, setCallActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [status, setStatus] = useState("Idle");

  function createPeerConnection() {
    const pc = new RTCPeerConnection(rtcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("voice:ice-candidate", {
          roomId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setStatus(`Connection: ${state}`);

      if (state === "connected") {
        setCallActive(true);
      }

      if (state === "failed" || state === "disconnected" || state === "closed") {
        setCallActive(false);
      }
    };

    pcRef.current = pc;
    setHasConnection(true);
    return pc;
  }

  async function ensureLocalAudio() {
    if (localStreamRef.current) return localStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    setHasLocalAudio(true);
    return stream;
  }

  async function attachLocalTracks(pc: RTCPeerConnection) {
    const stream = await ensureLocalAudio();

    const senders = pc.getSenders();
    const alreadyHasAudioTrack = senders.some((sender) => sender.track?.kind === "audio");

    if (!alreadyHasAudioTrack) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }
  }

  async function flushPendingCandidates() {
    if (!pcRef.current) return;

    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Failed to add queued ICE candidate:", err);
      }
    }

    pendingCandidatesRef.current = [];
  }

  async function startCall() {
    try {
      setStatus("Requesting microphone...");
      const pc = createPeerConnection();

      await attachLocalTracks(pc);

      setStatus("Creating offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("voice:offer", { roomId, offer });
      setStatus("Offer sent. Waiting for answer...");
    } catch (err) {
      console.error("Failed to start call:", err);
      setStatus("Failed to start call");
    }
  }

  async function handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      setStatus("Incoming offer...");
      const pc = pcRef.current ?? createPeerConnection();

      await attachLocalTracks(pc);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await flushPendingCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("voice:answer", { roomId, answer });
      setStatus("Answer sent...");
    } catch (err) {
      console.error("Failed to handle offer:", err);
      setStatus("Failed to handle incoming call");
    }
  }

  async function handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      await flushPendingCandidates();
      setStatus("Call connected");
      setCallActive(true);
    } catch (err) {
      console.error("Failed to handle answer:", err);
      setStatus("Failed to complete call setup");
    }
  }

  async function handleRemoteCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (!pcRef.current || !pcRef.current.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }

      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Failed to add ICE candidate:", err);
    }
  }

  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;

    const nextEnabled = !micEnabled;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = nextEnabled;
    });

    setMicEnabled(nextEnabled);
  }

  function cleanupConnection() {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    pendingCandidatesRef.current = [];
    setCallActive(false);
    setHasConnection(false);
  }

  function stopLocalAudio() {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setHasLocalAudio(false);
    }
  }

  function hangUp(notifyPeer = true) {
    if (notifyPeer) {
      socket.emit("voice:hangup", { roomId });
    }

    cleanupConnection();
    stopLocalAudio();
    setStatus("Call ended");
    setMicEnabled(true);

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  }

  useEffect(() => {
    const onOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      await handleOffer(offer);
    };

    const onAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      await handleAnswer(answer);
    };

    const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      await handleRemoteCandidate(candidate);
    };

    const onHangup = () => {
      cleanupConnection();
      stopLocalAudio();
      setStatus("Peer ended the call");
      setMicEnabled(true);

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    };

    const onVoiceError = ({ message }: { message: string }) => {
      setStatus(`Voice error: ${message}`);
    };

    socket.on("voice:offer", onOffer);
    socket.on("voice:answer", onAnswer);
    socket.on("voice:ice-candidate", onIceCandidate);
    socket.on("voice:hangup", onHangup);
    socket.on("voice:error", onVoiceError);

    return () => {
      socket.off("voice:offer", onOffer);
      socket.off("voice:answer", onAnswer);
      socket.off("voice:ice-candidate", onIceCandidate);
      socket.off("voice:hangup", onHangup);
      socket.off("voice:error", onVoiceError);

      hangUp(false);
    };
  }, [socket]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "8px" }}>
      <h3>Voice Chat</h3>
      <p>User: {userId}</p>
      <p>Status: {status}</p>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button onClick={startCall} disabled={callActive}>
          Start Voice Call
        </button>

        <button onClick={toggleMute} disabled={!hasLocalAudio}>
          {micEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button onClick={() => hangUp(true)} disabled={!hasConnection && !hasLocalAudio}>
          Hang Up
        </button>
      </div>

      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}