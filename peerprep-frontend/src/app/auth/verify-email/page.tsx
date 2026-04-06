'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { verifyEmail } from '@/src/services/user/userApi';
import { ROUTES } from '@/src/constant/route';
import { User } from '@/src/services/user/types';

const getRedirectRoute = (user: User, isEmailChange: boolean) => {
  // Email updated and send to profile page
  if (isEmailChange) {
    return user.access_role === 'admin' ? ROUTES.ADMIN_PROFILE : ROUTES.USER_PROFILE;
  }

  // Auto login and send to the home page
  return user.access_role === 'admin' ? ROUTES.ADMIN : ROUTES.USER;
};

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  );
  const [message, setMessage] = useState(
    token ? '' : 'Invalid verification link'
  );

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then((data) => {
        login(data.token, data.user);
        setStatus('success');
        sessionStorage.removeItem('pendingEmail');

        const redirectRoute = getRedirectRoute(data.user, data.isEmailChange);
        setTimeout(() => router.push(redirectRoute), 2000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-500 animate-pulse">Loading...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}