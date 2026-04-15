'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AttemptWithDetails } from '@/src/services/attempt/types';
import { fetchAttemptById } from '@/src/services/attempt/attemptApi';
import QuestionPanel from '@/src/components/attempt/QuestionPanel';
import AttemptPanel from '@/src/components/attempt/AttemptPanel';
import ModelAnswerPanel from '@/src/components/attempt/ModelAnswerPanel';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [attempt, setAttempt] = useState<AttemptWithDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttemptById(id)
      .then((data) => setAttempt(data as AttemptWithDetails))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-sm text-zinc-500">Loading...</div>;
  if (error || !attempt) return <div className="p-10 text-sm text-red-500">Failed to load attempt.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900">
            Question Attempt Details
          </h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <QuestionPanel question={attempt.question} />
          <AttemptPanel attempt={attempt} />
          <ModelAnswerPanel question={attempt.question} />
        </div>
      </div>
    </div>
  );
}
