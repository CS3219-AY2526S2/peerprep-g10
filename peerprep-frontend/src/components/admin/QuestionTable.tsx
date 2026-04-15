// AI Assistance Disclosure:
// Tool: Claude, date: 2026-03-11 (PR #14), 2026-04-05 (PR #47)
// Scope: Generated the admin question listing table (columns for title,
//   topics, difficulty badge, edit/delete actions) styled with Tailwind.
// Author review: Reviewed for correctness and integrated as-is.
'use client';

import { Question } from '@/src/services/types';
import { ROUTES } from '@/src/constant/route';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DifficultyBadge from './DifficultyBadge';

interface QuestionTableProps {
  questions: Question[];
  onDelete: (question: Question) => void;
}

export default function QuestionTable({ questions, onDelete }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">No questions found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-600">Title</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Topics</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Difficulty</th>
            <th className="px-4 py-3 font-medium text-zinc-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3 font-medium max-w-xs truncate">
                <Link
                  href={ROUTES.ADMIN_QUESTIONS_EDIT(q.id)}
                  className="text-zinc-900 hover:text-blue-600 transition-colors"
                >
                  {q.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-600">
                <div className="flex flex-wrap gap-1">
                  {q.topics.map((t) => (
                    <span key={t} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <DifficultyBadge difficulty={q.difficulty} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={ROUTES.ADMIN_QUESTIONS_EDIT(q.id)}
                    className="rounded p-1.5 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(q)}
                    className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
