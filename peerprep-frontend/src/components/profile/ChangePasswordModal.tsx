'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3004/api/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[500px] relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">Change Password</h2>
        <p className="text-gray-500 mb-6 text-sm">Enter your current password to confirm changes.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">Current Password</label>
            <div className="relative">
              <input
                type={show.currentPassword ? 'text' : 'password'}
                required
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
              />
              <button type="button" onClick={() => setShow({ ...show, currentPassword: !show.currentPassword })} className="absolute right-4 bottom-3 text-gray-400 hover:text-blue-600">
                {show.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">New Password</label>
            <div className="relative">
              <input
                type={show.newPassword ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
              />
              <button type="button" onClick={() => setShow({ ...show, newPassword: !show.newPassword })} className="absolute right-4 bottom-3 text-gray-400 hover:text-blue-600">
                {show.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">Confirm New Password</label>
            <div className="relative">
              <input
                type={show.confirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
              />
              <button type="button" onClick={() => setShow({ ...show, confirmPassword: !show.confirmPassword })} className="absolute right-4 bottom-3 text-gray-400 hover:text-blue-600">
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
          <button type="button" onClick={onClose} className="w-full text-gray-500 text-sm font-medium hover:underline">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}