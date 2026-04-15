// AI Assistance Disclosure:
// Tool: ChatGPT date: 2026‑03‑12
// Scope: Generated the initial boilerplate code based on our finalized architecture and component boundaries.
// Author review: Edited as the project progressed

"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import type { Socket } from "socket.io-client";
import { SocketIOYjsProvider } from "./SocketIO-YJS-provider";
import { keymap } from "@codemirror/view";
import { insertNewline } from "@codemirror/commands";

type Props = {
  roomId: string;
  socket: Socket;
  userId: string;
  displayName: string;
  initialCode: string;
  onCodeChange?: (code: string) => void;
};

export default function CodeEditor({roomId, socket, userId, displayName, initialCode, onCodeChange}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const onCodeChangeRef = useRef(onCodeChange);
  const providerRef = useRef<SocketIOYjsProvider | null>(null);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) {
      return;
    }

    provider.awareness.setLocalStateField("user", {
      name: displayName || userId,
      color: "#30bced",
      colorLight: "#30bced33",
    });
  }, [displayName, userId]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
      
    const updateListener = EditorView.updateListener.of((update) => {
      if (!update.docChanged) {
        return;
      }

      const code = update.state.doc.toString();
      onCodeChangeRef.current?.(code);
    });

    const ydoc = new Y.Doc();
    const provider = new SocketIOYjsProvider({
      roomId,
      socket,
      doc: ydoc,
    });

    providerRef.current = provider;

    const ytext = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    const state = EditorState.create({
      doc: "",
      extensions: [keymap.of([{key: "Enter", run: insertNewline}]),
      basicSetup, python(), updateListener, yCollab(ytext, provider.awareness, {undoManager}),],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

  return () => {
      providerRef.current = null;
      provider.destroy();
      ydoc.destroy();
      view.destroy();
    };
  }, [roomId, socket, userId]);

  return <div ref={editorRef} style={{ height: "100%" }} />;
}
