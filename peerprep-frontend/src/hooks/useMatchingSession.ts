import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from '@/src/constant/api';
import { NotificationProps } from '@/src/components/Notification';

interface MatchFoundPayload {
  roomId: string;
  question: unknown;
  partnerId: string;
}

interface MatchErrorPayload {
  message: string;
}

interface UseMatchingSessionOptions {
  onAuthError?: () => void;
  onMatchFound?: (payload: MatchFoundPayload) => void;
}

interface StartMatchParams {
  topic: string;
  difficulty: string;
  token?: string | null;
}

export function useMatchingSession({ onAuthError, onMatchFound }: UseMatchingSessionOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationProps | null>(null);

  const cancelMatch = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsMatching(false);
    setActiveNotification(null);
  }, []);

  const startMatch = useCallback(({ topic, difficulty, token }: StartMatchParams) => {
    if (isMatching) {
      return;
    }

    const socket = io(API_BASE.MATCHING_SERIVCE, {
      auth: {
        token,
      },
      query: {
        topic,
        difficulty: difficulty.toLowerCase(),
      },
    });

    socketRef.current = socket;
    setIsMatching(true);

    socket.on('connect', () => {
      setActiveNotification({
        type: 'info',
        title: 'Finding you a coding partner ...',
        message: '',
        rightAction: 'spinner',
        actionButton: {
          label: 'Cancel',
          variant: 'outlined',
          onClick: cancelMatch,
        },
      });
    });

    socket.on('MATCH_FOUND', (payload: MatchFoundPayload) => {
      console.log(`MATCH FOUND: ${JSON.stringify(payload)}`);
      onMatchFound?.(payload);
      cancelMatch();
    });

    socket.on('MATCH_ERROR', (error: MatchErrorPayload) => {
      console.log(`MATCH ERROR: ${error.message}`);
      setActiveNotification({
        type: 'error',
        title: 'Unable to find a match right now',
        message: error.message,
        rightAction: 'close',
      });
      setIsMatching(false);
      socket.disconnect();
      socketRef.current = null;
    });

    socket.on('connect_error', (err: Error) => {
      console.error('Connection rejected:', err.message);
      setIsMatching(false);
      socket.disconnect();
      socketRef.current = null;

      if (err.message === 'Authentication error: Invalid or expired token') {
        onAuthError?.();
        return;
      }

      setActiveNotification({
        type: 'error',
        title: 'Connection failed',
        message: err.message,
        rightAction: 'close',
      });
    });
  }, [cancelMatch, isMatching, onAuthError, onMatchFound]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    activeNotification,
    isMatching,
    startMatch,
    cancelMatch,
    setActiveNotification,
  };
}