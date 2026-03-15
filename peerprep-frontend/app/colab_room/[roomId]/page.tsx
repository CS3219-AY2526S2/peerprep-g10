"use client";

import CodeEditor from "@/colab_components/CodeEditor";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import styles from "./room.module.css";

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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

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
        setMessages(data);
      } catch (err) {
        console.error("Failed to load chat history:", err);
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

  if (loadingRoom) {
    return <main className={styles.page}>Loading room...</main>;
  }

  if (!room) {
    return <main className={styles.page}>Room not found.</main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.logo}>PeerPrep</div>
        <button className={styles.leaveButton} onClick={() => router.push("/")}>
          Leave Session
        </button>
      </div>

      <div className={styles.roomInfo}>
        Room ID: <span>{roomId}</span>
      </div>

      <div className={styles.workspace}>
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

        <section className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <strong>Chat</strong>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, idx) => {
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
        </section>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.footerLeft}>
          <button className={styles.iconButton}>🎤</button>
          <button className={styles.iconButton}>📷</button>
        </div>

        <div className={styles.timer}>20 : 30</div>

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
  );
}