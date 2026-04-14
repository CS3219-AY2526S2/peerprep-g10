import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness.js";
import type { Socket } from "socket.io-client";

type ProviderOptions = {
  roomId: string;
  socket: Socket;
  doc: Y.Doc;
};

export class SocketIOYjsProvider {
  roomId: string;
  socket: Socket;
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;

  private onDocUpdate: (update: Uint8Array, origin: unknown) => void;
  private onAwarenessUpdate: ({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }, origin: unknown) => void;
  private onRemoteSyncStep2: (payload: { roomId: string; update: number[] }) => void;
  private onRemoteUpdate: (payload: { roomId: string; update: number[] }) => void;
  private onRemoteAwareness: (payload: { roomId: string; update: number[] }) => void;

  constructor({ roomId, socket, doc }: ProviderOptions) {
    this.roomId = roomId;
    this.socket = socket;
    this.doc = doc;
    this.awareness = new awarenessProtocol.Awareness(doc);

    this.onDocUpdate = (update, origin) => {
      if (origin === this) return;

      this.socket.emit("yjs:update", {
        roomId: this.roomId,
        update: Array.from(update),
      });
    };

    this.onAwarenessUpdate = ({ added, updated, removed }, origin) => {
      if (origin === this) return;

      const changedClients = added.concat(updated, removed);
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients
      );

      this.socket.emit("yjs:awareness", {
        roomId: this.roomId,
        update: Array.from(awarenessUpdate),
      });
    };

    this.onRemoteSyncStep2 = ({ roomId, update }) => {
      if (roomId !== this.roomId) return;
      Y.applyUpdate(this.doc, Uint8Array.from(update), this);
    };

    this.onRemoteUpdate = ({ roomId, update }) => {
      if (roomId !== this.roomId) return;
      Y.applyUpdate(this.doc, Uint8Array.from(update), this);
    };

    this.onRemoteAwareness = ({ roomId, update }) => {
      if (roomId !== this.roomId) return;
      awarenessProtocol.applyAwarenessUpdate(
        this.awareness,
        Uint8Array.from(update),
        this
      );
    };

    this.doc.on("update", this.onDocUpdate);
    this.awareness.on("update", this.onAwarenessUpdate);

    this.socket.on("yjs:sync-step2", this.onRemoteSyncStep2);
    this.socket.on("yjs:update", this.onRemoteUpdate);
    this.socket.on("yjs:awareness", this.onRemoteAwareness);

    this.connect();
  }

  connect() {
    const stateVector = Y.encodeStateVector(this.doc);
    this.socket.emit("yjs:sync-step1", {
      roomId: this.roomId,
      stateVector: Array.from(stateVector),
    });
  }

  destroy() {
    // Mark local awareness offline
    this.awareness.setLocalState(null);

    this.doc.off("update", this.onDocUpdate);
    this.awareness.off("update", this.onAwarenessUpdate);

    this.socket.off("yjs:sync-step2", this.onRemoteSyncStep2);
    this.socket.off("yjs:update", this.onRemoteUpdate);
    this.socket.off("yjs:awareness", this.onRemoteAwareness);

    this.awareness.destroy();
  }
}