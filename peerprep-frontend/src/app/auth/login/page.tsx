'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import Link from 'next/link';
import { Input } from '@/src/components/Inputs';
import { Button } from '@/src/components/Button';
import { ROUTES } from '@/src/constant/route';
import { login as loginApi} from '@/src/services/user/userApi';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') return '';

    const reason = new URLSearchParams(window.location.search).get('reason');
    if (reason === 'deleted') return 'Your account has been deleted.';
    if (reason === 'banned') return 'Your account has been banned.';
    return '';
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    loginApi(email, password)
      .then(({ token, user }) => {
        const role = login(token, user);
        router.push(role === 'admin' ? ROUTES.ADMIN : ROUTES.USER);
      })
      .catch((err) => {
        if (typeof err?.message === 'string') {
          if (err.message.toLowerCase().includes('deleted')) {
            setError('Your account has been deleted.');
            return;
          }

          if (err.message.toLowerCase().includes('banned')) {
            setError('Your account has been banned.');
            return;
          }
        }

        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden bg-gray-50">
        {/* Center content */}
        <div className="relative z-10 max-w-md text-center px-8">
          {/* Logo mark */}
          <div className="flex justify-center mb-10">
            <svg width="96" height="96" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="10" fill="#0F62FE"/>
              <polyline points="10,24 19,14 19,34" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="38,24 29,14 29,34" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="32" x2="27" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">PeerPrep</h2>
          <p className="text-gray-600 text-xl leading-relaxed mb-16">
            Master the technical interview with peers around the globe.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: '⟨/⟩', label: 'Live coding interviews' },
              { icon: '⊙', label: 'Real interview questions' },
              { icon: '↗', label: 'Track your progress' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <span className="text-blue-600 font-mono text-lg w-10 text-center">{icon}</span>
                <span className="text-gray-700 text-base font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Login</h1>
          <p className="text-gray-500 mb-8">Welcome back! Enter your details below.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="email" name="email" label="Email" type="email" placeholder="name@example.com" required />
            <Input id="password" name="password" label="Password" type="password" isPassword placeholder="••••••••" required />
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}