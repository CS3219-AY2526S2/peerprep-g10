'use client';

import { useState } from 'react';
import { resendVerification } from '@/src/services/user/userApi';

export default function CheckEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);

    const email = sessionStorage.getItem('pendingEmail');

    if (!email) {
      setIsError(true);
      setMessage('Session expired. Please register again.');
      setLoading(false);
      return;
    }

    resendVerification(email)
      .then(() => {
        setIsError(false);
        setMessage('Verification email resent. Check your inbox!');
      })
      .catch((err: unknown) => {
        setIsError(true);
        setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-10 max-w-sm w-full text-center">

        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mx-auto mb-4">
          <rect x="8" y="20" width="56" height="38" rx="6" fill="#EFF4FF" stroke="#0F62FE" strokeWidth="1.5" />
          <path d="M8 26 L36 44 L64 26" stroke="#0F62FE" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="54" cy="22" r="10" fill="#0F62FE" />
          <path d="M49 22 L53 26 L60 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#EFF4FF] text-[#0C447C] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] inline-block" />
          Check your inbox
        </span>

        <h1 className="text-xl font-semibold text-zinc-900 mb-2">Verify your email</h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-1">
          We&apos;ve sent a verification link to your email address. Click the link to activate your account.
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5">
          Didn&apos;t receive it? Check your spam folder or resend below.
        </p>

        <button
          onClick={handleResend}
          disabled={loading}
          style={{ background: '#0F62FE' }}
          className="w-full py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Resending...' : 'Resend email'}
        </button>

        {message && (
          <p className={`mt-3 text-xs ${isError ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}