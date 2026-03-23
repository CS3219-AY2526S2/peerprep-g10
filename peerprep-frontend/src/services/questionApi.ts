import { API_BASE } from '@/src/constant/api';
import { Question, QuestionFormData } from './types';

const BASE_URL = `${API_BASE.QUESTION_SERVICE}/questions`;

export async function fetchAllQuestions(): Promise<Question[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function fetchQuestion(id: number): Promise<Question> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch question');
  return res.json();
}

export async function createQuestion(data: QuestionFormData): Promise<Question> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create question');
  }
  return res.json();
}

export async function updateQuestion(id: number, data: QuestionFormData): Promise<Question> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update question');
  }
  return res.json();
}

export async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete question');
}

export async function fetchTopics(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  const data = await res.json();
  return data.topics;
}
