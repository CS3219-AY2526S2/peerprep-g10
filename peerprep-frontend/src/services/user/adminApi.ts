import { API_BASE } from '@/src/constant/api';
import { User } from './types';

const BASE_URL = `${API_BASE.USER_SERVICE}/api/users`;
const getToken = () => localStorage.getItem('token');

export async function fetchAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/all-users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!res.ok) throw new Error('Failed to fetch all users');

  return res.json();
}

export async function createAdmin(username: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/create-admin`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (data?.message) {
        throw new Error(data.message);
    }

    if (data?.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      throw new Error(data.errors[firstErrorKey]);
    }
    throw new Error('Admin creation failed');
  }
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || 'Failed to delete user');
}

export async function banUser(id: number, isBanned: boolean): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}/ban`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ is_banned: isBanned }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || 'Failed to ban user');

  return json.user;
}