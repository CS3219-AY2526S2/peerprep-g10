'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/Inputs';
import { Button } from '@/src/components/Button';
import { ROUTES } from '@/src/constant/route';
import { createAdmin } from '@/src/services/user/adminApi';

export default function CreateAdminPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    createAdmin(username, email, password)
      .then(() => router.push(`${ROUTES.ADMIN}?tab=users`))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Create Admin Account</h2>
        <button
          onClick={() => router.push(`${ROUTES.ADMIN}?tab=users`)}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Form Card */}
      <div className="mt-6 rounded-xl bg-white border border-zinc-200 p-8">
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input id="username" name="username" label="Username" required />
          <Input id="email" name="email" label="Email" type="email" required />
          <Input id="password" name="password" label="Password" type="password" isPassword required />
          <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" isPassword required />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Add Admin'}
          </Button>
        </form>
      </div>
    </div>
  );
}