'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/Inputs';
import { Button } from '@/src/components/Button';
import { ROUTES } from '@/src/constant/route';
import { register } from '@/src/services/user/userApi';

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);

    const username = form.get('username') as string;
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const confirmPassword = form.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    register(username, email, password)
      .then(() => setRegistered(true))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-white">

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full">

          <h1 className="text-4xl font-bold mb-8">Registration</h1>

          {error && (
            <p className="mb-4 text-red-500 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input id="username" name="username" label="Username" required />

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              required
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              isPassword
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              isPassword
              required
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>

          </form>

          <p className="mt-6 text-center">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-blue-600 font-bold">
              Login
            </Link>
          </p>

        </div>
      </div>

      {registered && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
          Registration successful! Please check your email to verify your account.
        </div>
      )}

    </div>
  );
}