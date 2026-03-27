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

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token)
    .then((data) => {
      login(data.token, data.user);
      setStatus('success');
      sessionStorage.removeItem('pendingEmail');
      setTimeout(() => router.push(ROUTES.USER), 2000);
    })
    .catch((err) => {
      setStatus('error');
      setMessage(err.message);
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {status === 'loading' && <p className="text-zinc-500 animate-pulse">Verifying your email...</p>}
      {status === 'success' && <p className="text-green-600">Email verified! Redirecting...</p>}
      {status === 'error' && <p className="text-red-500">{message}</p>}
    </div>
  );
}