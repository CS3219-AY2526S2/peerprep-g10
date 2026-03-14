"use client";

import CodeEditor from "@/colab_components/CodeEditor";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

export default function RoomPage() {
	const params = useParams();
	const searchParams = useSearchParams();

	const roomId = params.roomId as string;
	const userId = searchParams.get("user") ?? "user1";
	const displayName = userId;

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [users, setUsers] = useState<PresenceUser[]>([]);
	const [text, setText] = useState("");

	const [socket] = useState(() => io("http://localhost:3001"));

	useEffect(() => {
		async function loadChatHistory() {
			try {
				const res = await fetch(`http://localhost:3001/rooms/${roomId}/chat`);
				const data = await res.json();
				setMessages(data);
			} catch (err) {
				console.error("Failed to load chat history:", err);
			}
		}

		loadChatHistory();

		socket.emit("room:join", {
			roomId,
			userId,
			displayName
		});

		socket.on("presence:update", (payload: { roomId: string; users: PresenceUser[] }) => {
			setUsers(payload.users);
		});

		socket.on("chat:new", (msg: ChatMessage) => {
			setMessages((prev) => [...prev, msg]);
		});

		socket.on("chat:error", (err: { message: string }) => {
			console.error("Chat error:", err.message);
		});

		return () => {
			socket.emit("room:leave", { roomId, userId });

			socket.off("presence:update");
			socket.off("chat:new");
			socket.off("chat:error");

			socket.disconnect();
		};
	}, [roomId, socket, displayName, userId]);

	function sendMessage() {
		const trimmed = text.trim();
		if (!trimmed) return;

		socket.emit("chat:send", {
			roomId,
			userId,
			message: trimmed
		});

		setText("");
	}

	return (
		<main className={styles.page}>
			<div className={styles.topBar}>
				<div className={styles.logo}>PeerPrep</div>
				<button className={styles.leaveButton}>Leave Session</button>
			</div>

			<div className={styles.roomInfo}>
				Room ID: <span>{roomId}</span>
			</div>

			<div className={styles.workspace}>

				<section className={styles.questionPanel}>
					<div className={styles.metaRow}>
						<span className={styles.metaItem}>Topic: Hash Table</span>
						<span className={styles.metaItem}>Difficulty: Easy</span>
					</div>

					<h1 className={styles.questionTitle}>Two Sums</h1>

					<p className={styles.description}>
						Given an array of integers and a specific integer, target, your task is to identify
						the indices of the two numbers such that they add up to the target value.
					</p>

					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>Code Example</h2>

						<div className={styles.codeExample}>
							<pre>
								{`input = [1, 2, 4, 8]
								expected_output = two_sum(input)
								print(expected_output)
								# expected_output = 123`}
							</pre>
						</div>
					</div>

					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>Images</h2>

						<div className={styles.imagePlaceholder}>
							<div className={styles.imageX}>✕</div>
						</div>
					</div>
				</section>

				<section className={styles.editorPanel}>
          <div className={styles.editorArea}>
            <CodeEditor
              roomId={roomId}
              socket={socket}
              userId={userId}
              initialCode={`def two_sum(nums, target): pass`} />
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
									<div
										className={
											isOwn
												? styles.messageBubbleRight
												: styles.messageBubbleLeft
										}
									>
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

						<button
							className={styles.sendButton}
							onClick={sendMessage}
						>
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