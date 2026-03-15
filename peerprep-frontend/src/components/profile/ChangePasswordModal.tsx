'use client';
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { updatePassword } from '@/src/user/userApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({currentPassword: '', newPassword: '', confirmPassword: ''});
  const [show, setShow] = useState({currentPassword: false, newPassword: false, confirmPassword: false});

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    setError('');
    updatePassword(form.currentPassword, form.newPassword)
      .then(() => onClose())
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  };

  const inputClass = `border dark:border-zinc-600 p-3 w-full rounded-xl 
    bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-zinc-500
    focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-10 w-full max-w-[500px] relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Change Password</h2>
        <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">Enter your current password to confirm changes.</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-4 text-sm border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 ml-1 uppercase">Current Password</label>
            <div className="relative">
              <input
                type={show.currentPassword ? 'text' : 'password'}
                required
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className={inputClass}
              />
              <button type="button" onClick={() => setShow({ ...show, currentPassword: !show.currentPassword })} className="absolute right-4 bottom-3 text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400">
                {show.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 ml-1 uppercase">New Password</label>
            <div className="relative">
              <input
                type={show.newPassword ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className={inputClass}
              />
              <button type="button" onClick={() => setShow({ ...show, newPassword: !show.newPassword })} className="absolute right-4 bottom-3 text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400">
                {show.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 ml-1 uppercase">Confirm New Password</label>
            <div className="relative">
              <input
                type={show.confirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={inputClass}
              />
              <button type="button" onClick={() => setShow({ ...show, confirmPassword: !show.confirmPassword })} className="absolute right-4 bottom-3 text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400">
                {show.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            disabled={saving}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-gray-500 dark:text-zinc-400 text-sm font-medium hover:underline">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}