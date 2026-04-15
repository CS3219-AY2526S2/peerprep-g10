// AI Assistance Disclosure:
// Tool: Claude, date: 2026-03-11 (PR #14), 2026-04-13 (PR #75)
// Scope: Generated the admin "edit question" page (fetch existing question
//   by id, pre-populate the QuestionForm, submit updates) and the later
//   split of starter pseudocode from model solution in the form flow.
// Author review: Reviewed for correctness and integrated as-is.
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchQuestion, updateQuestion } from '@/src/services/questionApi';
import { Question, QuestionFormData } from '@/src/services/types';
import { ROUTES } from '@/src/constant/route';
import QuestionForm from '@/src/components/admin/QuestionForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion(id)
      .then(setQuestion)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: QuestionFormData) => {
    await updateQuestion(id, data);
    router.push(ROUTES.ADMIN);
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading question...</p>;
  }

  if (!question) {
    return <p className="text-sm text-red-600">Question not found.</p>;
  }

  const initialData: QuestionFormData = {
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    topics: question.topics,
    examples: question.examples ?? '',
    pseudocode: question.pseudocode ?? '',
    solution: question.solution ?? '',
    image_url: question.image_url ?? '',
  };

  return (
    <div>
      <Link
        href={ROUTES.ADMIN}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Edit Question</h1>
      <div className="mt-6">
        <QuestionForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
