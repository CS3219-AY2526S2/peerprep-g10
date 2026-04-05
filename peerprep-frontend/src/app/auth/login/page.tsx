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
  const [error, setError] = useState('');
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
        const role = login(token, user); // save to auth context
        router.push(role === 'admin' ? ROUTES.ADMIN : ROUTES.USER);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-900">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-zinc-800 items-center justify-center border-r border-gray-100 dark:border-zinc-700">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 shadow-lg shadow-blue-200" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PeerPrep</h2>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">
            Master the technical interview with peers around the globe.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Login</h1>
          <p className="text-gray-500 dark:text-zinc-400 mb-8">Welcome back! Enter your details below.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="email" name="email" label="Email" type="email" placeholder="name@example.com" required />
            <Input id="password" name="password" label="Password" type="password" isPassword placeholder="••••••••" required />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-zinc-400">
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