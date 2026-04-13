'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AttemptWithDetails } from '@/src/services/attempt/types';
import { ROUTES } from '@/src/constant/route';

interface AttemptHistoryTableProps {
  attempts: AttemptWithDetails[];
  pageSize?: number;
}

const FALLBACK_PARTNER_NAME = 'Account deleted';

function getSafeAvatarSrc(icon: string | null | undefined): string | null {
  if (!icon || !icon.trim()) return null;

  try {
    if (icon.startsWith('/')) return icon;

    const parsed = new URL(icon);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return icon;
  } catch {
    return null;
  }
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function AttemptHistoryTable({
  attempts,
  pageSize = 5,
}: AttemptHistoryTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [failedAvatarIds, setFailedAvatarIds] = useState<Set<string>>(new Set());

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 160"
          className="mb-4 w-40 h-40 opacity-80"
          aria-hidden="true"
        >
          <rect x="45" y="20" width="110" height="130" rx="8" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="2" />
          <rect x="75" y="12" width="50" height="18" rx="5" fill="#d4d4d8" />
          <rect x="82" y="10" width="36" height="12" rx="4" fill="#a1a1aa" />
          <rect x="62" y="55" width="76" height="8" rx="3" fill="#d4d4d8" />
          <rect x="62" y="73" width="60" height="8" rx="3" fill="#e4e4e7" />
          <rect x="62" y="91" width="70" height="8" rx="3" fill="#e4e4e7" />
          <rect x="62" y="109" width="50" height="8" rx="3" fill="#e4e4e7" />
          <circle cx="148" cy="118" r="22" fill="white" stroke="#a1a1aa" strokeWidth="3" />
          <circle cx="148" cy="118" r="13" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="2" />
          <line x1="164" y1="134" x2="176" y2="148" stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />
          <text x="148" y="123" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a1a1aa">?</text>
        </svg>
        <p className="text-sm font-medium text-zinc-500">No attempts yet</p>
        <p className="mt-1 text-xs text-zinc-400">Your coding session history will appear here.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(attempts.length / pageSize);
  const paginated = attempts.slice((page - 1) * pageSize, page * pageSize);

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium text-zinc-600">Question</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Type</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Difficulty</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Peer</th>
              <th className="px-4 py-3 font-medium text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginated.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-900 max-w-xs">
                  <span className="truncate block">{attempt.question.title}</span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  <div className="flex flex-wrap gap-1">
                    {attempt.question.topics.map((topic) => (
                      <span key={topic} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                        {topic}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded px-1.5 py-0.5 text-xs capitalize ${DIFFICULTY_STYLES[attempt.question.difficulty] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {attempt.question.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const partnerName = attempt.partner?.username?.trim() || FALLBACK_PARTNER_NAME;
                        const avatarSrc = failedAvatarIds.has(attempt.id)
                          ? null
                          : getSafeAvatarSrc(attempt.partner?.profile_icon);

                        if (!avatarSrc) {
                          return <UserIcon className="w-4 h-4 text-gray-400 opacity-60" />;
                        }

                        return (
                          <Image
                            src={avatarSrc}
                            alt={partnerName}
                            width={256}
                            height={256}
                            className="w-full h-full object-cover"
                            onError={() => {
                              setFailedAvatarIds((prev) => {
                                const next = new Set(prev);
                                next.add(attempt.id);
                                return next;
                              });
                            }}
                          />
                        );
                      })()}
                    </div>
                    <span>{attempt.partner?.username?.trim() || FALLBACK_PARTNER_NAME}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => router.push(ROUTES.USER_ATTEMPT_DETAILS(attempt.id))}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹ Previous
          </button>

          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-zinc-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded px-3 py-1 transition-colors ${
                  p === page ? 'bg-blue-600 text-white font-medium' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
