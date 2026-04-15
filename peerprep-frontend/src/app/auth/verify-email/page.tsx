// AI Assistance Disclosure:
// Tool: ChatGPT (GPT-5.3), date: 2026-04-06
// Scope: Assisted in debugging ESLint errors and refactoring React hooks usage.
// Author review: Refactored logic, improved typing, and verified correctness.

// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-02
// Scope: Generated React SVG component for verify email status icon.
// Author review: Accepted as-is and integrated directly into UI.
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

const icons = {
  loading: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4">
      <circle cx="32" cy="32" r="24" fill="#EFF4FF" stroke="#0F62FE" strokeWidth="1.5" strokeDasharray="8 4" />
      <circle cx="32" cy="32" r="10" fill="#0F62FE" fillOpacity="0.15" />
      <circle cx="32" cy="32" r="5" fill="#0F62FE" />
    </svg>
  ),
  success: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4">
      <circle cx="32" cy="32" r="24" fill="#EFF4FF" stroke="#0F62FE" strokeWidth="1.5" />
      <path d="M22 32 L29 39 L42 25" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  error: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4">
      <circle cx="32" cy="32" r="24" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
      <path d="M24 24 L40 40 M40 24 L24 40" stroke="#E24B4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

const states = {
  loading: { pill: 'bg-[#EFF4FF] text-[#0C447C]', dot: 'bg-[#0F62FE]', label: 'In progress', title: 'Verifying your email...', sub: 'Please wait a moment.' },
  success: { pill: 'bg-green-50 text-green-800', dot: 'bg-green-500', label: 'Verified', title: 'Email verified!', sub: 'Redirecting you now...' },
  error:   { pill: 'bg-red-50 text-red-800',   dot: 'bg-red-500',   label: 'Failed',     title: 'Verification failed', sub: 'This link may be expired or invalid.' },
};

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? '' : 'Invalid verification link');

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

  const s = states[status];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-10 max-w-sm w-full text-center">
        {icons[status]}

        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-4 ${s.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.dot}`} />
          {s.label}
        </span>

        <p className="text-lg font-semibold text-zinc-900 mb-1">{s.title}</p>
        <p className="text-sm text-zinc-500">{status === 'error' ? message || s.sub : s.sub}</p>

        {status === 'error' && (
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            style={{ background: '#0F62FE' }}
            className="mt-6 w-full py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-400 animate-pulse text-sm">Loading...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}