'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { verifyEmail } from '@/src/services/user/userApi';
import { ROUTES } from '@/src/constant/route';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) return;

    verifyEmail(token)
    .then((data) => {
      login(data.token, data.user);
      setStatus('success');
      sessionStorage.removeItem('pendingEmail');

      if (data.isEmailchange) {
        // Redirect to correct profile based on role
        const profileRoute = data.user.access_role === 'admin'
          ? ROUTES.ADMIN_PROFILE
          : ROUTES.USER_PROFILE;
        setTimeout(() => router.push(profileRoute), 2000);
      } else {
        // Registration verification — redirect to home
        const homeRoute = data.user.access_role === 'admin'
          ? ROUTES.ADMIN
          : ROUTES.USER;
        setTimeout(() => router.push(homeRoute), 2000);
      }
    })
    .catch((err) => {
      setStatus('error');
      setMessage(err.message);
    });
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {status === 'loading' && (
        <p className="text-zinc-500 animate-pulse">Verifying your email...</p>
      )}
      {status === 'success' && (
        <p className="text-green-600">Email verified! Redirecting...</p>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="text-red-500 mb-4">{message}</p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}