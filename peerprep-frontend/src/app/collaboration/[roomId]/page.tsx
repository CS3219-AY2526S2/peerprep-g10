"use client";

import CodeEditor from "@/src/components/collaboration/CodeEditor";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import styles from "./room.module.css";
import { Navbar } from "@/src/components/navbar/Navbar";

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
};

type TestCase = {
  input: string;
  expectedOutput: string;
};

type RoomData = {
  id: string;
  title: string;
  topic: string | null;
  difficulty: string | null;
  description: string;
  codeExample: string | null;
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
  const displayName = userId;

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const [chatWidth, setChatWidth] = useState(360);
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  const [questionWidth, setQuestionWidth] = useState(420);
  const [isDraggingQuestion, setIsDraggingQuestion] = useState(false);

  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const [socket] = useState(() => io("http://localhost:3001"));

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await fetch(`http://localhost:3001/rooms/${roomId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load room");
        }

        setRoom(data);
        setSessionStartedAt(Date.now());
      } catch (err) {
        console.error("Failed to load room:", err);
      } finally {
        setLoadingRoom(false);
      }
    }

    async function loadChatHistory() {
      try {
        const res = await fetch(`http://localhost:3001/rooms/${roomId}/chat`);
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

    socket.emit("room:join", {
      roomId,
      userId,
      displayName,
    });

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

    socket.on("presence:update", handlePresenceUpdate);
    socket.on("chat:new", handleChatNew);
    socket.on("chat:error", handleChatError);
    socket.on("room:error", handleRoomError);

    return () => {
      socket.emit("room:leave", { roomId, userId });

      socket.off("presence:update", handlePresenceUpdate);
      socket.off("chat:new", handleChatNew);
      socket.off("chat:error", handleChatError);
      socket.off("room:error", handleRoomError);

      socket.disconnect();
    };
  }, [roomId, socket, displayName, userId, router]);

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
    if (!isDraggingChat) return;

    function handleMouseMove(e: MouseEvent) {
      if (!workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();

      const minChatWidth = 0;
      const maxChatWidth = Math.max(280, workspaceRect.width - 500);

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
  }, [isDraggingChat]);

  useEffect(() => {
    if (!isDraggingQuestion) return;

    function handleMouseMove(e: MouseEvent) {
      if (!workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();

      const minQuestionWidth = 280;
      const maxQuestionWidth = Math.max(420, workspaceRect.width - chatWidth - 450);

      const newWidth = e.clientX - workspaceRect.left;
      const clampedWidth = Math.min(
        Math.max(newWidth, minQuestionWidth),
        maxQuestionWidth
      );

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
  }, [isDraggingQuestion, chatWidth]);

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
    return (
      <>
        <Navbar />
        <main className={styles.page}>Loading room...</main>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>Room not found.</main>
      </>
    );
  }

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.logo}>PeerPrep</div>
            <div className={styles.roomInfo}>
              Room ID: <span>{roomId}</span>
            </div>
          </div>

          <div className={styles.topBarRight}>
            <button
              type="button"
              className={styles.chatToggleTopButton}
              onClick={toggleChatPanel}
            >
              {isChatOpen ? "Hide Chat" : "Show Chat"}
            </button>

            <button className={styles.leaveButton} onClick={() => router.push("/")}>
              Leave Session
            </button>
          </div>
        </div>

        <div className={styles.workspace} 
        ref={workspaceRef} 
        style={{
          "--question-width": `${questionWidth}px`,
          "--chat-width": `${isChatOpen ? chatWidth : 0}px`,} as React.CSSProperties}>
          <section className={styles.questionPanel}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>Topic: {room.topic ?? "N/A"}</span>
              <span className={styles.metaItem}>Difficulty: {room.difficulty ?? "N/A"}</span>
            </div>

            <h1 className={styles.questionTitle}>{room.title}</h1>

            <p className={styles.description}>{room.description}</p>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Code Example</h2>

              <div className={styles.codeExample}>
                <pre>{room.codeExample ?? "No example provided."}</pre>
              </div>
            </div>

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

          <section className={styles.editorPanel}>
            <div className={styles.editorArea}>
              <CodeEditor
                roomId={roomId}
                socket={socket}
                userId={userId}
                initialCode={room.currentCode}
              />
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
                className={styles.chatToggleButton}
                onClick={toggleChatPanel}
              >
                {isChatOpen ? "Hide" : "Show"}
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
            <button className={styles.iconButton}>🎤</button>
          </div>

          <div className={styles.timer}> Elapsed: {formatElapsedTime(elapsedSeconds)} </div>

          <div className={styles.participants}>
            {users.map((user) => (
              <div key={user.userId} className={styles.participant}>
                <div className={styles.avatar}>◯</div>
                <span>{user.displayName}</span>
              </div>
            ))}
          </div>

          <button className={styles.saveButton}>Save</button>
        </div>
      </main>
    </>
  );
}