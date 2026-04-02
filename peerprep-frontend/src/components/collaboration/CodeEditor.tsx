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
};

export default function CodeEditor({ roomId, socket, userId, displayName, initialCode }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  // const viewRef = useRef<EditorView | null>(null);
  // const applyingRemoteRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
      
    // const updateListener = EditorView.updateListener.of((update) => {
    //   if (!update.docChanged) {
    //     return;
    //   }
        
    //   if (applyingRemoteRef.current) {
    //     return;
    //   }

    //   const code = update.state.doc.toString();

    //   console.log("sending editor:replace", code);

    //   socket.emit("editor:replace", {
    //     roomId,
    //     code,
    //   });
    // });

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
    // if (ytext.length === 0 && initialCode) {
    //   ydoc.transact(() => {
    //     ytext.insert(0, initialCode);
    //   }, provider);
    // }

    const state = EditorState.create({
      doc: "",
      extensions: [keymap.of([{key: "Enter", run: insertNewline}]),
      basicSetup, python(), yCollab(ytext, provider.awareness, {undoManager}),],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    // viewRef.current = view;

    // const handleRemoteReplace = (payload: { code: string }) => {
    //   console.log("received editor:replace", payload.code);

    //   const currentView = viewRef.current;
    //   if (!currentView) {
    //     return;
    //   }

    //   const currentCode = currentView.state.doc.toString();
    //   if (currentCode === payload.code) {
    //     return;
    //   }
      
    //   applyingRemoteRef.current = true;

    //   currentView.dispatch({
    //     changes: {
    //       from: 0,
    //       to: currentCode.length,
    //       insert: payload.code,
    //     },
    //   });

    //   applyingRemoteRef.current = false;
    // };

    // socket.on("editor:replace", handleRemoteReplace);

  //   return () => {
  //     socket.off("editor:replace", handleRemoteReplace);
  //     view.destroy();
  //     viewRef.current = null;
  //   };
  // }, [roomId, socket, initialCode]);

  return () => {
      provider.destroy();
      ydoc.destroy();
      view.destroy();
    };
  }, [roomId, socket, userId, displayName]);

  return <div ref={editorRef} style={{ height: "100%" }} />;
}