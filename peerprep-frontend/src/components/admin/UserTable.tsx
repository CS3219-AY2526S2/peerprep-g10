'use client';

import { User } from '@/src/services/user/types';
import Image from 'next/image';
import { Trash2, UserIcon } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onBan: (user: User) => void;
  onDelete: (user: User) => void;
  currentUserId?: number;
}

export default function UserTable({ users, onBan, onDelete, currentUserId }: UserTableProps) {
  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">No users found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-600">Username</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Email</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Role</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
            <th className="px-4 py-3 font-medium text-zinc-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3 font-medium text-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {user.profile_icon
                      ? <Image src={user.profile_icon} alt={user.username} width={256} height={256} className="w-full h-full object-cover" />
                      : <UserIcon className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                    }
                  </div>
                  <span className="truncate max-w-xs">{user.username}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-600">{user.email}</td>
              <td className="px-4 py-3 text-zinc-600 capitalize">{user.access_role}</td>
              <td className="px-4 py-3">
                {user.is_banned
                  ? <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">Banned</span>
                  : <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-600">Active</span>
                }
              </td>
              {user.id != currentUserId && (
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {user.access_role !== 'admin' && (
                    <button
                      onClick={() => onBan(user)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-yellow-50 hover:text-yellow-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {user.is_banned ? 'Unban' : 'Ban'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}