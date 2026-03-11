'use client';

import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import EditProfileModal from '@/src/components/profile/EditProfileModal';
import ChangePasswordModal from '@/src/components/profile/ChangePasswordModal';

export default function ProfilePage() {

  const [user,setUser] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editOpen,setEditOpen] = useState(false);
  const [passwordOpen,setPasswordOpen] = useState(false);

  useEffect(()=> {
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
  },[]);

  if(loading){
    return <div className="flex justify-center p-20">Loading...</div>
  }

  if (error || !user) {
    return <div className="flex justify-center p-20 text-red-500">Error: {error || "Could not load user"}</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm">

        <div className="flex justify-between mb-6">

          <span>Username</span>

          <div className="flex gap-3">
            <span>{user.username}</span>
            <Pencil onClick={()=>setEditOpen(true)} className="cursor-pointer"/>
          </div>

        </div>

        <div className="flex justify-between mb-6">

          <span>Email</span>

          <div className="flex gap-3">
            <span>{user.email}</span>
            <Pencil onClick={()=>setEditOpen(true)} className="cursor-pointer"/>
          </div>

        </div>

        <button
          onClick={()=>setPasswordOpen(true)}
          className="text-blue-600 font-bold"
        >
          Change Password
        </button>

      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={()=>setEditOpen(false)}
        username={user.username}
        userEmail={user.email}
        onSuccess={(updatedUser) => setUser(updatedUser)}
      />

      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={()=>setPasswordOpen(false)}
      />

    </div>
  );
}