'use client';

import { useEffect, useState, useMemo } from 'react';
import { Question } from '@/src/services/types';
import { fetchAllQuestions, deleteQuestion } from '@/src/services/questionApi';
import { ROUTES } from '@/src/constant/route';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import QuestionTable from '@/src/components/admin/QuestionTable';
import Pagination from '@/src/components/admin/Pagination';
import DeleteConfirmModal from '@/src/components/admin/DeleteConfirmModal';

const ITEMS_PER_PAGE = 10;

type Tab = 'questions' | 'users';

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('questions');
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  useEffect(() => {
    fetchAllQuestions()
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return questions;
    const q = search.toLowerCase();
    return questions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.topics.some((t) => t.toLowerCase().includes(q))
    );
  }, [questions, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteQuestion(deleteTarget.id);
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'questions', label: 'Questions' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'questions' && (
        <div className="mt-6">
          {/* Search + Add */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Link
              href={ROUTES.ADMIN_QUESTIONS_CREATE}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Question
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-500">Loading questions...</p>
          ) : (
            <>
              <div className="mt-4">
                <QuestionTable questions={paginated} onDelete={setDeleteTarget} />
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="mt-6">
          <p className="py-12 text-center text-sm text-zinc-500">
            User management coming soon.
          </p>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
