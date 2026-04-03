import { API_BASE } from '@/src/constant/api';
import { Attempt } from './types';

const BASE_URL = `${API_BASE.COLLAB_SERVICE}/attempts`;

export async function saveAttempt(data: {
  roomId: string;
  userId: string;
  partnerId: string;
  questionId: string;
  code: string;
  startedAt: string;
  endedAt: string;
}): Promise<Attempt> {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save attempt');
  return json;
}

export async function fetchAttemptsByUser(userId: string): Promise<Attempt[]> {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || 'Failed to fetch attempts');
  return json;
}

export async function fetchAttemptById(id: string): Promise<Attempt> {
  const res = await fetch(`${BASE_URL}/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch attempt');
  return json;
}