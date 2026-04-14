import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from '@/src/constant/api';
import { ROUTES } from '@/src/constant/route';
import { NotificationProps } from '@/src/components/Notification';

interface MatchFoundPayload {
  roomId: string;
  question: unknown;
  userId: string;
  partnerId: string;
}

interface MatchErrorPayload {
  message: string;
}

interface UseMatchingSessionOptions {
  onAuthError?: () => void;
  onMatchFound?: (roomId: string, userId: string) => void;
  matchingTimeoutSeconds?: number;
}

interface StartMatchParams {
  topic: string[];
  difficulty: string[];
  filterUnattempted?: boolean;
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
  const [relaxedNotification, setRelaxedNotification] = useState<NotificationProps | null>(null);

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
    setRelaxedNotification(null);
  }, [clearTimers]);

  // Handles the account-status notification and countdown before redirecting to login
  const handleAccountStatusNotification = useCallback((reason: 'banned' | 'deleted') => {
    localStorage.removeItem('token');

    let remaining = 5;

    const showNotification = () =>
      setActiveNotification({
        type: 'error',
        title: reason === 'deleted' ? 'Deleted' : 'Banned',
        message: reason === 'deleted'
          ? `Your account has been deleted. Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`
          : `Your account has been banned. Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`,
        rightAction: 'none',
      });

    showNotification();

    const interval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(interval);
        window.location.href = `${ROUTES.LOGIN}?reason=${reason}`;
      } else {
        showNotification();
      }
    }, 1000);
  }, []);

  const startMatch = useCallback(({ topic, difficulty, filterUnattempted, token }: StartMatchParams) => {
    if (isMatching) {
      return;
    }

    const socket = io("/", {
      path: `${API_BASE.MATCHING_SERIVCE}/socket.io`,
      auth: {
        token,
      },
      query: {
        topic,
        difficulty: difficulty.map(d => d.toLowerCase()),
        filterUnattempted: filterUnattempted ? 'true' : 'false',
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
      
      cancelMatch();
      onMatchFound?.(payload.roomId, payload.userId);
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

    // Force-logout event — server disconnects the socket when the user is banned mid-session
    socket.on('force-logout', (payload?: { reason?: 'USER_BANNED' | 'USER_DELETED' }) => {
      cancelMatch();
      handleAccountStatusNotification(payload?.reason === 'USER_DELETED' ? 'deleted' : 'banned');
    });

    socket.on('connect_error', (err: Error) => {
      console.error('Connection rejected:', err.message);
      clearTimers();
      setIsMatching(false);
      socket.disconnect();
      socketRef.current = null;

      // Banned users are blocked at connection time — show notification before redirecting
      if (err.message === 'USER_BANNED') {
        handleAccountStatusNotification('banned');
        return;
      }

      if (err.message === 'USER_DELETED') {
        handleAccountStatusNotification('deleted');
        return;
      }

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

    socket.on('PROPOSE_RELAXED_MATCH', (payload: { candidateId: string, sharedTopics: string[], sharedDifficulties: string[] }) => {
      const difficultyStr = payload.sharedDifficulties.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(' or ');
      setRelaxedNotification({
        type: 'info',
        title: `Found a coding partner attempting ${difficultyStr} difficulty`,
        message: 'Would you like to try another difficulty for faster matching?',
        rightAction: 'close',
        onClose: () => {
          socket.emit('DECLINE_RELAXED_MATCH', { candidateId: payload.candidateId });
          setRelaxedNotification(null);
        },
        actionButton: {
          label: 'Challenge',
          variant: 'filled',
          onClick: () => {
            socket.emit('ACCEPT_RELAXED_MATCH', payload);
            setRelaxedNotification(current => current ? { ...current, rightAction: 'spinner', actionButton: undefined } : null);
          }
        }
      });
    });

    socket.on('RELAXED_MATCH_UNAVAILABLE', () => {
      setRelaxedNotification(null);
    });
  }, [cancelMatch, clearTimers, handleAccountStatusNotification, isMatching, onAuthError, onMatchFound, timeoutInSeconds]);

  useEffect(() => {
    return () => {
      clearTimers();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [clearTimers]);

  return {
    activeNotification,
    relaxedNotification,
    isMatching,
    startMatch,
    cancelMatch,
    setActiveNotification,
    setRelaxedNotification,
  };
}