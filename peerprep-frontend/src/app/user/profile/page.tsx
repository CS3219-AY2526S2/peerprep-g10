'use client';
import { useState, useEffect } from 'react';
import { User } from '@/src/user/types';
import { fetchProfile } from '@/src/user/userApi';
import ProfileCard from '@/src/components/profile/ProfileCard';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile()
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []);

  if (loading) {
    return <div>Loading Profile...</div>;
  }
  if (error || !user) {
    return <div>Error...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">My Profile</h1>
        <ProfileCard user={user} onSuccess={setUser} />
        {/* Attempt History */}
      </div>
    </div>
  );
}
