'use client';
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { User } from '@/src/services/user/types';
import { updateProfile } from '@/src/services/user/userApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  userEmail: string;
  onSuccess: (userData: User, emailChanged: boolean) => void;
}

export default function EditProfileModal({ isOpen, onClose, userEmail, username, onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ newEmail: userEmail, newUsername: username, password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    updateProfile({ email: form.newEmail, username: form.newUsername, password: form.password })
      .then((result) => {
        onSuccess(result.user, result.emailChanged);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  };

  const inputClass = `border p-3 w-full rounded-xl
    bg-white text-zinc-900
    placeholder:text-gray-400
    focus:ring-2 focus:ring-blue-500 outline-none transition-all`;

  const labelClass = "text-xs font-semibold text-gray-500 ml-1 uppercase";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[500px] relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-zinc-900">Edit Profile</h2>
        <p className="text-gray-500 mb-6 text-sm">Update your account information below.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Username</label>
            <input
              required
              placeholder="New Username"
              value={form.newUsername}
              onChange={(e) => setForm({ ...form, newUsername: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              required
              type="email"
              placeholder="New Email"
              value={form.newEmail}
              onChange={(e) => setForm({ ...form, newEmail: e.target.value.toLowerCase() })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter current password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-gray-400 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            disabled={saving}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {saving ? 'Verifying & Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-gray-500 text-sm font-medium hover:underline">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}