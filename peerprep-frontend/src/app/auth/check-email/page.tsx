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
        setMessage('Verification email resent. Please check your inbox!');
      })
      .catch((err: unknown) => {
        setIsError(true);
        setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <p className="mb-6">
        We&apos;ve sent a verification link to your email. Please check your inbox and click the link to activate your account.
      </p>
      <p className="mb-6 text-sm text-zinc-500">
        Didn&apos;t receive the email? Check your spam folder or click the button below to resend.
      </p>
      <button
        onClick={handleResend}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Resending...' : 'Resend Email'}
      </button>
      {message && (
        <p className={`mt-4 text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}