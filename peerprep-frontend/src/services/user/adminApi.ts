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
