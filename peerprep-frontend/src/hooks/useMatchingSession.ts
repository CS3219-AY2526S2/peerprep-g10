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
  matchingTimeoutSeconds?: number;
}

interface StartMatchParams {
  topic: string;
  difficulty: string;
  token?: string | null;
}

const DEFAULT_MATCHING_TIMEOUT_SECONDS = 120;

export function useMatchingSession({
  onAuthError,
  onMatchFound,
  matchingTimeoutSeconds = DEFAULT_MATCHING_TIMEOUT_SECONDS,
}: UseMatchingSessionOptions = {}) {
  const timeoutInSeconds = Math.max(1, matchingTimeoutSeconds);
  const socketRef = useRef<Socket | null>(null);
  const matchingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedSecondsRef = useRef(0);
  const [isMatching, setIsMatching] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationProps | null>(null);

  const clearTimers = useCallback(() => {
    if (matchingTimeoutRef.current) {
      clearTimeout(matchingTimeoutRef.current);
      matchingTimeoutRef.current = null;
    }

    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }

    elapsedSecondsRef.current = 0;
  }, []);

  const cancelMatch = useCallback(() => {
    clearTimers();
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsMatching(false);
    setActiveNotification(null);
  }, [clearTimers]);

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
      clearTimers();
      elapsedSecondsRef.current = 0;

      setActiveNotification({
        type: 'info',
        title: 'Finding you a coding partner ...',
        message: `Time Elaspe: ${elapsedSecondsRef.current}s`,
        rightAction: 'spinner',
        actionButton: {
          label: 'Cancel',
          variant: 'outlined',
          onClick: cancelMatch,
        },
      });

      elapsedIntervalRef.current = setInterval(() => {
        elapsedSecondsRef.current += 1;
        setActiveNotification((current) => {
          if (!current || current.type !== 'info' || current.rightAction !== 'spinner') {
            return current;
          }

          return {
            ...current,
            message: `Time Elaspe: ${elapsedSecondsRef.current}s`,
          };
        });
      }, 1000);

      matchingTimeoutRef.current = setTimeout(() => {
        cancelMatch();
        setActiveNotification({
          type: 'warning',
          title: 'No coding partner available now',
          message: 'Try again with another sets of criteria',
          rightAction: 'close',
        });
      }, timeoutInSeconds * 1000);
    });

    socket.on('MATCH_FOUND', (payload: MatchFoundPayload) => {
      console.log(`MATCH FOUND: ${JSON.stringify(payload)}`);
      onMatchFound?.(payload);
      cancelMatch();
    });

    socket.on('MATCH_ERROR', (error: MatchErrorPayload) => {
      console.log(`MATCH ERROR: ${error.message}`);
      clearTimers();
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
      clearTimers();
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
  }, [cancelMatch, clearTimers, isMatching, onAuthError, onMatchFound, timeoutInSeconds]);

  useEffect(() => {
    return () => {
      clearTimers();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [clearTimers]);

  return {
    activeNotification,
    isMatching,
    startMatch,
    cancelMatch,
    setActiveNotification,
  };
}