'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { User } from '@/src/user/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentIcon: string;
  onSuccess: (updateUser: User) => void;
}

export default function ChangeIconModal({ isOpen, onClose, currentIcon, onSuccess }: Props) {
  const [selected, setSelected] = useState<string>(currentIcon ?? 'default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarOptions, setAvatarOptions] = useState<{ key: string; url: string }[]>([]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const fetchAvatars = async () => {
      try {
        const res = await fetch('http://localhost:3004/api/users/avatars');
        const data = await res.json();
        setAvatarOptions(data.avatars ?? []);
      } catch {
        setError('Failed to load avatars');
      }
    };
    fetchAvatars();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!selected) return;
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3004/api/users/me/icon', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profile_icon: selected }),
      });

      if (!res.ok) throw new Error('Failed to update icon');

      const data = await res.json();
      const updatedUser = data.user as User;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 w-[500px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Choose Avatar</h2>
          <X
            className="cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            onClick={onClose}
          />
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {avatarOptions.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 col-span-5">Loading avatars...</p>
          ) : (
            avatarOptions.map(({ key, url }) => (
              <div
                key={key}
                onClick={() => setSelected(url)}
                className={`cursor-pointer rounded-full border-2 p-1 transition-all ${
                  selected === url
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <img src={url} className="w-full h-full rounded-full object-cover" />
              </div>
            ))
          )}
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !selected}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}