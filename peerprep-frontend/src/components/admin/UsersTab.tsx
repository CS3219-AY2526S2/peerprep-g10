// AI Assistance Disclosure:
// Tool: ChatGPT (GPT-5.3), date: 2026-04-06
// Scope: Assisted in debugging ESLint errors and refactoring React hooks usage.
// Author review: Refactored logic, improved typing, and verified correctness.
'use client';

import { useEffect, useState, useMemo } from 'react';
import { User } from '@/src/services/user/types';
import { fetchAllUsers, deleteUser, banUser } from '@/src/services/user/adminApi';
import { Plus, Search } from 'lucide-react';
import UserTable from '@/src/components/admin/UserTable';
import Pagination from '@/src/components/admin/Pagination';
import DeleteConfirmModal from '@/src/components/admin/DeleteConfirmModal';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constant/route';
import { useAuth } from '@/src/context/AuthContext';

const ITEMS_PER_PAGE = 10;

export default function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const loadUsers = () => {
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.access_role.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleBanToggle = async (user: User) => {
    banUser(user.id, !user.is_banned)
    .then((updated) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
    })
    .catch((err) => setError(err.message))
    .finally(() => setDeleteTarget(null));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    deleteUser(deleteTarget.id)
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id)))
      .catch((err) => setError(err.message))
      .finally(() => setDeleteTarget(null));
  };

  return (
    <div>
      {/* Search + Add Admin Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by username, email or role..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => router.push(ROUTES.ADMIN_CREATE_ADMIN)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Admin User
        </button>
      </div>

      {error && (
            <p className="mb-4 text-red-500 text-sm text-center mx-auto font-bold">{error}</p>
      )}

      {/* User Table */}
      {loading ? (
        <p className="py-12 text-center text-sm text-zinc-500">Loading users...</p>
      ) : (
        <>
          <div className="mt-4">
            <UserTable users={paginated} onBan={handleBanToggle} onDelete={setDeleteTarget} currentUserId={currentUser?.id} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.username}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}