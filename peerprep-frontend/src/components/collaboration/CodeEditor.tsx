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

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

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

    const ytext = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: displayName || userId,
      color: "#30bced",
      colorLight: "#30bced33",
    });

    // Seed initial code only if the shared text is empty
    if (ytext.length === 0 && initialCode) {
      ydoc.transact(() => {
        ytext.insert(0, initialCode);
      }, provider);
    }

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
      provider.destroy();
      ydoc.destroy();
      view.destroy();
    };
  }, [roomId, socket, userId, displayName, initialCode]);

  return <div ref={editorRef} style={{ height: "100%" }} />;
}