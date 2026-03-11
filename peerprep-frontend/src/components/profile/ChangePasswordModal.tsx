'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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

  const [error,setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(form.newPassword !== form.confirmPassword){
      setError('Passwords do not match');
      return;
    }

    try{

      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3004/api/users/change-password',{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          currentPassword:form.currentPassword,
          newPassword:form.newPassword
        })
      });

      const data = await res.json();
      if(!res.ok) throw new Error(data.message);

      alert('Password updated');
      onClose();

    }catch(err:any){
      setError(err.message);
    }

  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl p-10 w-[500px] relative">

        <button onClick={onClose} className="absolute right-6 top-6">
          <X size={24}/>
        </button>

        <h2 className="text-2xl font-bold mb-6">Change Password</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e)=>setForm({...form,currentPassword:e.target.value})}
            className="border p-3 w-full rounded-xl"
          />

          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e)=>setForm({...form,newPassword:e.target.value})}
            className="border p-3 w-full rounded-xl"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
            className="border p-3 w-full rounded-xl"
          />

          <button className="bg-green-600 text-white w-full py-3 rounded-xl">
            Update Password
          </button>

        </form>

      </div>

    </div>
  );
}