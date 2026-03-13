'use client';
import { useState, useEffect } from 'react';
import { Pencil, User } from 'lucide-react';
import EditProfileModal from '@/src/components/profile/EditProfileModal';
import ChangePasswordModal from '@/src/components/profile/ChangePasswordModal';
import ChangeIconModal from '@/src/components/profile/ChangeIconModal';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const res = await fetch('http://localhost:3004/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
        console.log("Profile Page:" + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center p-20">Loading...</div>;
  if (error || !user) return <div className="flex justify-center p-20 text-red-500">Error: {error || "Could not load user"}</div>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm">

        {/* Change Password top right */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setPasswordOpen(true)} className="text-blue-500 text-sm">
            Change Password
          </button>
        </div>

        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              {user.profile_icon
                ? <img src={`/icons/${user.profile_icon}.png`} className="w-full h-full rounded-full object-cover" />
                : <User className="w-8 h-8 text-gray-400" />
              }
            </div>
            <span onClick={() => setIconOpen(true)} className="text-blue-500 text-sm cursor-pointer">Change Avatar</span>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between">
              <span className="font-semibold">Username</span>
              <div className="flex gap-3 items-center">
                <span>{user.username}</span>
                <Pencil size={16} onClick={() => setEditOpen(true)} className="cursor-pointer text-blue-500" />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Email</span>
              <div className="flex gap-3 items-center">
                <span>{user.email}</span>
                <Pencil size={16} onClick={() => setEditOpen(true)} className="cursor-pointer text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        username={user.username}
        userEmail={user.email}
        onSuccess={(updatedUser) => setUser(updatedUser)}
      />
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      <ChangeIconModal
        isOpen={iconOpen}
        onClose={() => setIconOpen(false)}
        currentIcon={user.profile_icon ?? 'default'}
        onSuccess={(newIcon) => setUser({ ...user, profile_icon: newIcon })}
      />
    </div>
  );
}