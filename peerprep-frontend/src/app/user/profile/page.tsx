'use client';
import { useState, useEffect } from 'react';
import { User } from '@/src/services/user/types';
import { AttemptWithDetails } from '@/src/services/attempt/types';
import { fetchProfile } from '@/src/services/user/userApi';
import { fetchAttemptsByUser } from '@/src/services/attempt/attemptApi';
import ProfileCard from '@/src/components/profile/ProfileCard';
import AttemptHistoryTable from '@/src/components/attempt/AttemptHistoryTable';
import Notification from '@/src/components/Notification';
import { useProfileNotifications } from '@/src/hooks/useProfileNotifications';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    activeNotification,
    setActiveNotification,
    handleProfileSuccess,
    handlePasswordSuccess,
    handleIconSuccess,
  } = useProfileNotifications();

  useEffect(() => {
    fetchProfile()
      .then((user) => {
        setUser(user);
        return fetchAttemptsByUser(String(user.id));
      })
      .then((attempts) => setAttempts(attempts as AttemptWithDetails[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Profile...</div>;
  if (error || !user) return <div>Error...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {activeNotification && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <Notification
            {...activeNotification}
            onClose={() => setActiveNotification(null)}
          />
        </div>
      )}
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">My Profile</h1>
        {/* Profile Card */}
        <ProfileCard
          user={user!}
          onProfileSuccess={(updatedUser, emailChanged) => handleProfileSuccess(updatedUser, emailChanged, setUser)}
          onPasswordSuccess={handlePasswordSuccess}
          onIconSuccess={(updatedUser) => handleIconSuccess(updatedUser, setUser)}
        />
        {/* Attempt History */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Attempt History
          </h2>

          <AttemptHistoryTable
            attempts={attempts}
          />
        </div>
      </div>
    </div>
  );
}
