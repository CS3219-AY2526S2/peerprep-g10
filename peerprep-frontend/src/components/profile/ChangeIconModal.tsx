'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { User } from '@/src/services/user/types';
import { fetchAvatarOptions, updateProfileIcon } from '@/src/services/user/userApi';

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
  const { setUser } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    fetchAvatarOptions()
      .then(setAvatarOptions)
      .catch((err) => setError(err.message));
    
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);

    updateProfileIcon(selected)
      .then((updatedUser) => {
        setUser(updatedUser);
        onSuccess(updatedUser);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
                <Image src={url} alt="Profile avatar" width={256} height={256} className="w-full h-full rounded-full object-cover" />
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