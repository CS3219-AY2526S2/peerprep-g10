'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Pencil, User as UserIcon } from 'lucide-react';
import EditProfileModal from '@/src/components/profile/EditProfileModal';
import ChangePasswordModal from '@/src/components/profile/ChangePasswordModal';
import ChangeIconModal from '@/src/components/profile/ChangeIconModal';
import { User } from '@/src/services/user/types';

interface Props {
  user: User;
  onProfileSuccess: (updatedUser: User, emailChanged: boolean) => void;
  onPasswordSuccess: () => void;
  onIconSuccess: (updatedUser: User) => void;
}

export default function ProfileCard({ user, onProfileSuccess, onPasswordSuccess, onIconSuccess }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setPasswordOpen(true)}
          className="text-blue-500 text-sm hover:underline"
        >
          Change Password
        </button>
      </div>

      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            {user.profile_icon
              ? <Image src={user.profile_icon} alt="Profile avatar" width={256} height={256} className="w-full h-full rounded-full object-cover" />
              : <UserIcon className="w-8 h-8 text-gray-400" />
            }
          </div>
          <span
            onClick={() => setIconOpen(true)}
            className="text-blue-500 text-sm cursor-pointer hover:underline"
          >
            Change Avatar
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-700">Username</span>
            <div className="flex gap-3 items-center">
              <span className="text-zinc-900">{user.username}</span>
              <Pencil size={16} onClick={() => setEditOpen(true)} className="cursor-pointer text-blue-500" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-700">Email</span>
            <div className="flex gap-3 items-center">
              <span className="text-zinc-900">{user.email}</span>
              <Pencil size={16} onClick={() => setEditOpen(true)} className="cursor-pointer text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        key={editOpen ? 'open' : 'closed'}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        username={user.username}
        userEmail={user.email}
        onSuccess={onProfileSuccess}
      />
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={onPasswordSuccess}
      />
      <ChangeIconModal
        isOpen={iconOpen}
        onClose={() => setIconOpen(false)}
        currentIcon={user.profile_icon}
        onSuccess={onIconSuccess}
      />
    </div>
  );
}