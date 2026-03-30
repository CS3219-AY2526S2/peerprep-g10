import { API_BASE } from '@/src/constant/api';
import { User, UpdateProfileData } from './types';

const BASE_URL = `${API_BASE.USER_SERVICE}/api/users`;
const AUTH_BASE_URL = `${API_BASE.USER_SERVICE}/api/auth`;

const getToken = () => localStorage.getItem('token');

// Users
export async function fetchProfile(): Promise<User> {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!res.ok) throw new Error('Failed to fetch profile');

  return res.json();
}

export async function updateProfile(data: UpdateProfileData): Promise<{ user: User; emailChanged: boolean }> {
  const res = await fetch(`${BASE_URL}/update-profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  
  if (!res.ok) throw new Error(json.message || 'Failed to update profile');
  
  return json;
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();

  if (!res.ok) throw new Error(json.message || 'Failed to update password');
}

export async function updateProfileIcon(profileIcon: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/me/icon`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ profile_icon: profileIcon }),
  });
  
  const json = await res.json();
  
  if (!res.ok) throw new Error(json.message || 'Failed to update icon');
  
  return json.user;
}

export async function fetchAvatarOptions(): Promise<{ key: string; url: string }[]> {
  const res = await fetch(`${BASE_URL}/avatars`);
  
  if (!res.ok) throw new Error('Failed to fetch avatars');
  
  const data = await res.json();
  
  return data.avatars;
}

// Auth
export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Invalid Credentials');
  if (!data.token) throw new Error('No token received from server');

  return data;
}

export async function register(username: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    throw new Error('Registration failed');
  }
}

export async function verifyToken(): Promise<{ user: User }> {
  const res = await fetch(`${AUTH_BASE_URL}/verify-token`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!res.ok) throw new Error('Invalid token');
  
  return res.json();
}

export async function verifyEmail(token: string): Promise<{ isEmailChange: boolean; token: string; user: User }> {
  const res = await fetch(`${AUTH_BASE_URL}/verify-email?token=${token}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Failed to verify email');
  
  return data;
}

export async function resendVerification(email: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE_URL}/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => null);
  
  if (!res.ok) throw new Error(data?.message || 'Failed to resend verification email');
}