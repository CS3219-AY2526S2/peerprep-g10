'use client';

import { useRouter } from 'next/navigation';
import { createQuestion } from '@/src/services/questionApi';
import { QuestionFormData } from '@/src/services/types';
import { ROUTES } from '@/src/constant/route';
import QuestionForm from '@/src/components/admin/QuestionForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateQuestionPage() {
  const router = useRouter();

  const handleSubmit = async (data: QuestionFormData) => {
    await createQuestion(data);
    router.push(ROUTES.ADMIN);
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
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Create Question</h1>
      <div className="mt-6">
        <QuestionForm onSubmit={handleSubmit} submitLabel="Create Question" />
      </div>
    </div>
  );
}
