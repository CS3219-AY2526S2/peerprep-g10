// AI Assistance Disclosure:
// Tool: ChatGPT date: 2026‑03‑12, 2026‑03‑28, 2026‑03-30
// Scope: Generated boilerplate and implementation for UI/backend, WebRTC signaling, and YJS CRDT, strictly based on our predefined architecture and interfaces.
// Author review: Edited as the project progressed and added new features

"use client";

import CodeEditor from "@/src/components/collaboration/CodeEditor"
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { MessageCircle, X } from "lucide-react";
import styles from "./room.module.css";
import VoiceChat from "@/src/components/collaboration/VoiceChat";
import { API_BASE } from "@/src/constant/api";
import { saveAttempt } from '@/src/services/attempt/attemptApi';
import { ROUTES } from '@/src/constant/route';
import Notification, { NotificationProps } from '@/src/components/Notification';

const BACKEND_URL = process.env.NEXT_PUBLIC_COLLAB_BACKEND_URL || "/api/collab";

type ParticipantInfo = {
  userId: string;
  displayName: string;
  profileIcon?: string;
};

type ChatMessage = {
  id?: string;
  roomId: string;
  userId: string;
  message: string;
  createdAt?: string;
};

type PresenceUser = {
  userId: string;
  displayName: string;
  profileIcon?: string;
};

type TestCase = {
  input: string;
  expectedOutput: string;
};

type RoomData = {
  id: string;
  questionId: string;
  user1Id: string;
  user2Id: string;
  title: string;
  topics: string[];
  difficulty: string | null;
  description: string;
  starterCode: string;
  currentCode: string;
  testCases: TestCase[];
  createdAt: string;
};

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = params.roomId as string;
  const userId = searchParams.get("user") ?? "user1";

  const [joinedRoom, setJoinedRoom] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const currentPresenceUser = users.find((u) => u.userId === userId);
  const displayName = currentPresenceUser?.displayName || userId;

  const [chatWidth, setChatWidth] = useState(360);
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const [questionWidth, setQuestionWidth] = useState(420);
  const [isDraggingQuestion, setIsDraggingQuestion] = useState(false);

  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const participantList: ParticipantInfo[] = useMemo(() => {
    if (!room) return [];

    const presenceMap = new Map(users.map((u) => [u.userId, {displayName: u.displayName, profileIcon: u.profileIcon},]));

    return [
      {
        userId: room.user1Id,
        displayName: presenceMap.get(room.user1Id)?.displayName ?? room.user1Id,
        profileIcon: presenceMap.get(room.user1Id)?.profileIcon,
      },
      {
        userId: room.user2Id,
        displayName: presenceMap.get(room.user2Id)?.displayName ?? room.user2Id,
        profileIcon: presenceMap.get(room.user2Id)?.profileIcon,
      },
    ];
  }, [room, users]);

  const onlineUserIds = useMemo(() => new Set(users.map((u) => u.userId)), [users]);

  // Pass the JWT in the socket handshake so the server's io.use() middleware can verify
  // the user and check the ban blacklist before the connection is accepted
  const [socket] = useState(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return io("/", { path: `${API_BASE.COLLAB_SERVICE}/socket.io`, auth: { token } });
  });

  // Add ref to track current code without re-renders
  const currentCodeRef = useRef<string>('');
  const [attemptSaved, setAttemptSaved] = useState(false);
  const handleSaveAttemptRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const [activeNotification, setActiveNotification] = useState<Omit<NotificationProps, 'onClose'> | null>(null);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (!activeNotification) return;
    const timer = setTimeout(() => setActiveNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [activeNotification]);

  // Save attempt
  const handleSaveAttempt = async () => {
    if (!room) return;

    const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;

    try {
      await saveAttempt({
        roomId: room.id,
        userId,
        partnerId,
        questionId: room.questionId,
        code: currentCodeRef.current,
        startedAt: sessionStartedAt ? new Date(sessionStartedAt).toISOString() : room.createdAt,
        endedAt: new Date().toISOString(),
      });

      // Show notification
      setAttemptSaved(true);
      setActiveNotification({
        type: 'success',
        title: 'Attempt saved',
        message: 'Your code and attempt details have been saved successfully.',
      });
      setTimeout(() => setAttemptSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save attempt:', err);
      setActiveNotification({
        type: 'error',
        title: 'Save failed',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  // Keep ref pointing at the latest handleSaveAttempt
  handleSaveAttemptRef.current = handleSaveAttempt;

  const handleLeaveSession = async () => {
    socket.emit("room:leave", {roomId, userId});
    await handleSaveAttempt();
    router.push(ROUTES.USER);
  };

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load room");
        }

        setRoom(data);

        // Initialise currentCodeRef
        currentCodeRef.current = data.currentCode ?? '';
        setSessionStartedAt(new Date(data.createdAt).getTime());
      } catch (err) {
        console.error("Failed to load room:", err);
      } finally {
        setLoadingRoom(false);
      }
    }

    async function loadChatHistory() {
      try {
        const res = await fetch(`${BACKEND_URL}/rooms/${roomId}/chat`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load chat history");
        }
        setMessages(data);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([]);
      }
    }

    loadRoom();
    loadChatHistory();
    setJoinedRoom(false);

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("room:join", {roomId, userId});
    };

    const handleDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
      setJoinedRoom(false);
    };

    const handleRoomJoined = (payload: { roomId: string; userId: string }) => {
      if (payload.roomId === roomId && payload.userId === userId) {
        setJoinedRoom(true);
      }
    };

    const handlePresenceUpdate = (payload: { roomId: string; users: PresenceUser[] }) => {
      setUsers(payload.users);
    };

    const handleChatNew = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleChatError = (err: {message: string }) => {
      console.error("Chat error:", err.message);
    };

    const handleRoomError = (err: {message: string }) => {
      console.error("Room error:", err.message);
      alert(err.message);
      router.push("/");
    };

    const handleEditorError = (err: { message: string }) => {
      console.error("Editor error:", err.message);
    };

    
    // Force-logout event — server disconnects the socket when the user is banned mid-session
    const handleAccountStatusLogout = async (reason: 'banned' | 'deleted') => {
      socket.disconnect();
      // Save attempt while the token is still in localStorage
      await handleSaveAttemptRef.current();
      localStorage.removeItem('token');
      
      let remaining = 5;
      const showNotification = () => setActiveNotification({
        type: 'error',
        title: reason === 'deleted' ? 'Deleted' : 'Banned',
        message: reason === 'deleted'
          ? `Your account has been deleted. Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`
          : `Your account has been banned. Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`,
        rightAction: 'none',
      });
      showNotification();
      const interval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
          clearInterval(interval);
          router.replace(`${ROUTES.LOGIN}?reason=${reason}`);
        } else {
          showNotification();
        }
      }, 1000);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    socket.on("room:joined", handleRoomJoined);
    const handleForceLogout = async (payload?: { reason?: 'USER_BANNED' | 'USER_DELETED' }) => {
      await handleAccountStatusLogout(payload?.reason === 'USER_DELETED' ? 'deleted' : 'banned');
    };

    const handleConnectError = async (err: { message: string }) => {
      if (err.message === 'USER_BANNED') {
        await handleAccountStatusLogout('banned');
        return;
      }

      if (err.message === 'USER_DELETED') {
        await handleAccountStatusLogout('deleted');
        return;
      }

      console.error('Socket connect error:', err.message);
      alert(err.message);
      router.push('/');
    };

    socket.on("presence:update", handlePresenceUpdate);
    socket.on("chat:new", handleChatNew);
    socket.on("chat:error", handleChatError);
    socket.on("editor:error", handleEditorError);
    socket.on("room:error", handleRoomError);
    socket.on("force-logout", handleForceLogout);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("presence:update", handlePresenceUpdate);
      socket.off("chat:new", handleChatNew);
      socket.off("chat:error", handleChatError);
      socket.off("editor:error", handleEditorError);
      socket.off("room:error", handleRoomError);
      socket.off("force-logout", handleForceLogout);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      // socket.disconnect();
    };
  }, [roomId, socket, userId, router]);

  useEffect(() => {
    if (!sessionStartedAt) return;

    const updateElapsed = () => {
      const now = Date.now();
      const seconds = Math.max(0, Math.floor((now - sessionStartedAt) / 1000));
      setElapsedSeconds(seconds);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [sessionStartedAt]);

  useEffect(() => {
    const syncDefaultSplit = () => {
      if (!workspaceRef.current) return;
      if (window.matchMedia("(max-width: 1100px)").matches) return;

      const workspaceWidth = workspaceRef.current.getBoundingClientRect().width;
      const nextQuestionWidth = Math.max(320, Math.floor(workspaceWidth / 3));
      setQuestionWidth(nextQuestionWidth);
    };

    syncDefaultSplit();
    window.addEventListener("resize", syncDefaultSplit);

    return () => {
      window.removeEventListener("resize", syncDefaultSplit);
    };
  }, []);

  useEffect(() => {
    if (!isDraggingChat) return;

    function handleMouseMove(e: MouseEvent) {
      if (!workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const rightRegionWidth = Math.max(360, workspaceRect.width - questionWidth - 20);

      const minChatWidth = 0;
      const maxChatWidth = Math.max(240, rightRegionWidth - 320);

      const newWidth = workspaceRect.right - e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, minChatWidth), maxChatWidth);

      setChatWidth(clampedWidth);

      if (clampedWidth < 40) {
        setIsChatOpen(false);
      } else {
        setIsChatOpen(true);
      }
    }

    function handleMouseUp() {
      setIsDraggingChat(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingChat, questionWidth]);

  useEffect(() => {
    if (!isDraggingQuestion) return;

    function handleMouseMove(e: MouseEvent) {
      if (!workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const minQuestionWidth = 280;
      const minRightWidth = 620;
      const maxQuestionWidth = Math.max(minQuestionWidth, workspaceRect.width - minRightWidth);

      const newWidth = e.clientX - workspaceRect.left;
      const clampedWidth = Math.min(Math.max(newWidth, minQuestionWidth), maxQuestionWidth);
      setQuestionWidth(clampedWidth);
    }

    function handleMouseUp() {
      setIsDraggingQuestion(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingQuestion]);


  function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed) return;

    socket.emit("chat:send", {
      roomId,
      userId,
      message: trimmed,
    });

    setText("");
  }

  function toggleChatPanel() {
    if (isChatOpen) {
      setIsChatOpen(false);
      setChatWidth(0);
    } else {
      setIsChatOpen(true);
      setChatWidth(360);
    }
  }

  function formatElapsedTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  if (loadingRoom) {
    return <main className={styles.page}>Loading room...</main>;
  }

  if (!room) {
    return <main className={styles.page}>Room not found.</main>;
  }

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <>
      {activeNotification && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <Notification
            {...activeNotification}
            onClose={() => setActiveNotification(null)}
          />
        </div>
      )}
      <main className={styles.page}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.logo}>PeerPrep</div>
            <div className={styles.roomInfo}>
              Room ID: <span>{roomId}</span>
            </div>
          </div>

          <div className={styles.topBarRight}>
            {/* Leave Session button */}
            <button className={styles.leaveButton} onClick={handleLeaveSession}>
              Leave Session
            </button>
            
          </div>
        </div>

        <div className={styles.workspace} 
        ref={workspaceRef} 
        style={{
          "--chat-width": `${isChatOpen ? chatWidth : 0}px`,
          "--question-width": `${questionWidth}px`,
        } as React.CSSProperties}>
          <section className={styles.questionPanel}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                Topics: {room.topics?.length ? room.topics.join(", ") : "N/A"}
              </span>
              <span className={styles.metaItem}>Difficulty: {room.difficulty ?? "N/A"}</span>
            </div>

            <h1 className={styles.questionTitle}>{room.title}</h1>

            <p className={styles.description}>{room.description}</p>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Test Cases</h2>

              <div className={styles.testCaseList}>
                {room.testCases.length === 0 ? (
                  <div>No test cases available.</div>
                ) : (
                  room.testCases.map((testCase, index) => (
                    <div key={index} className={styles.testCaseCard}>
                      <div>
                        <strong>Input:</strong> {testCase.input}
                      </div>
                      <div>
                        <strong>Expected:</strong> {testCase.expectedOutput}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <div
            className={styles.questionResizeHandle}
            onMouseDown={() => setIsDraggingQuestion(true)}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize question panel"
          />

          <div className={styles.rightColumn}>
            <div className={styles.rightPanelsContainer}>
              <section className={styles.editorPanel}>
                <div className={styles.editorArea}>
                  {joinedRoom ? (
                    <CodeEditor
                      roomId={roomId}
                      socket={socket}
                      userId={userId}
                      displayName={displayName}
                      initialCode={room.currentCode}
                      onCodeChange={(code) => { currentCodeRef.current = code; }}
                    />
                  ) : (<div>Joining collaboration session</div>)}
                </div>
              </section>

              <div
                className={`${styles.chatResizeHandle} ${!isChatOpen ? styles.chatResizeHandleCollapsed : ""}`}
                onMouseDown={() => setIsDraggingChat(true)}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize chat panel"
              />

              <section className={`${styles.chatPanel} ${!isChatOpen ? styles.chatPanelCollapsed : ""}`}>
                <div className={styles.chatHeader}>
                  <strong>Chat</strong>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={toggleChatPanel}
                    aria-label={isChatOpen ? "Close chat" : "Open chat"}
                    title={isChatOpen ? "Close chat" : "Open chat"}
                  >
                    {isChatOpen ? <X size={16} /> : <MessageCircle size={16} />}
                  </button>
                </div>
                {isChatOpen && (
                  <>
                    <div className={styles.messages}>
                      {safeMessages.map((msg, idx) => {
                        const isOwn = msg.userId === userId;

                        return (
                          <div
                            key={msg.id ?? `${msg.userId}-${idx}`}
                            className={isOwn ? styles.messageRowRight : styles.messageRowLeft}
                          >
                            <div className={isOwn ? styles.messageBubbleRight : styles.messageBubbleLeft}>
                              <strong>{msg.userId}</strong>
                              <div>{msg.message}</div>
                            </div>

                            {msg.createdAt && (
                              <span className={styles.messageTime}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.chatInputRow}>
                      <input
                        className={styles.chatInput}
                        placeholder="Write message"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendMessage();
                        }}
                      />

                      <button className={styles.sendButton} onClick={sendMessage}>
                        Send
                      </button>
                    </div>
                  </>
                )}
              </section>
            </div>

            <div className={styles.footerBar}>
              <div className={styles.footerLeft}>
                {socket && roomId && userId && (
                  <VoiceChat socket={socket} roomId={roomId} userId={userId} displayName={displayName} />
                )}

                <div className={styles.footerDivider} aria-hidden="true" />

                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.chatDockButton}`}
                  onClick={toggleChatPanel}
                  aria-label={isChatOpen ? "Close chat" : "Open chat"}
                  title={isChatOpen ? "Close chat" : "Open chat"}
                >
                  <MessageCircle size={16} />
                </button>
              </div>

              <div className={styles.timer}> Elapsed: {formatElapsedTime(elapsedSeconds)} </div>

              <div className={styles.participants}>
                {participantList.map((participant) => {
                  const isOnline = onlineUserIds.has(participant.userId);

                  return (
                    <div key={participant.userId} className={styles.participant}>
                      <div className={styles.avatar}>
                        {participant.profileIcon ? (
                          <img src={participant.profileIcon}
                            alt={`${participant.displayName} avatar`}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <span>◯</span>
                        )}
                      </div>

                      <span>{participant.displayName}</span>
                      <span>{isOnline ? "Online" : "Offline"}</span>
                    </div>
                  );
                })}
              </div>

              {/* Save attempt button */}
              <button className={styles.saveButton} onClick={handleSaveAttempt} disabled={attemptSaved}>
                {attemptSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}