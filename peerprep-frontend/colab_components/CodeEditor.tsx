"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import type { Socket } from "socket.io-client";

type Props = {
  roomId: string;
  socket: Socket;
  userId: string;
  initialCode: string;
};

export default function CodeEditor({ roomId, socket, initialCode }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const applyingRemoteRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
      
    const updateListener = EditorView.updateListener.of((update) => {
      if (!update.docChanged) {
        return;
      }
        
      if (applyingRemoteRef.current) {
        return;
      }

      const code = update.state.doc.toString();

      console.log("sending editor:replace", code);

      socket.emit("editor:replace", {
        roomId,
        code,
      });
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, python(), updateListener],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    const handleRemoteReplace = (payload: { code: string }) => {
      console.log("received editor:replace", payload.code);

      const currentView = viewRef.current;
      if (!currentView) {
        return;
      }

      const currentCode = currentView.state.doc.toString();
      if (currentCode === payload.code) {
        return;
      }
      
      applyingRemoteRef.current = true;

      currentView.dispatch({
        changes: {
          from: 0,
          to: currentCode.length,
          insert: payload.code,
        },
      });

      applyingRemoteRef.current = false;
    };

    socket.on("editor:replace", handleRemoteReplace);

    return () => {
      socket.off("editor:replace", handleRemoteReplace);
      view.destroy();
      viewRef.current = null;
    };
  }, [roomId, socket, initialCode]);

  return <div ref={editorRef} style={{ height: "100%" }} />;
}