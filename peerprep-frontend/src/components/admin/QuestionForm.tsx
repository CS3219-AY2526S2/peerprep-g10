// AI Assistance Disclosure:
// Tool: Claude, date: 2026-03-11 (PR #14), 2026-04-05 (PR #47)
// Scope: Generated the admin question form (controlled inputs for
//   title/description/examples, difficulty select, topic chip-picker with
//   topic fetch, pseudocode and solution fields) styled with Tailwind.
// Author review: Reviewed for correctness and integrated with minor
//   adjustments to types and routing.
'use client';

import { useEffect, useState } from 'react';
import { QuestionFormData } from '@/src/services/types';
import { fetchTopics } from '@/src/services/questionApi';
import { X } from 'lucide-react';

interface QuestionFormProps {
  initialData?: QuestionFormData;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  submitLabel: string;
}

const EMPTY_FORM: QuestionFormData = {
  title: '',
  description: '',
  difficulty: 'easy',
  topics: [],
  examples: '',
  pseudocode: '',
  solution: '',
  image_url: '',
};

export default function QuestionForm({ initialData, onSubmit, submitLabel }: QuestionFormProps) {
  const [form, setForm] = useState<QuestionFormData>(initialData ?? EMPTY_FORM);
  const [topicInput, setTopicInput] = useState('');
  const [existingTopics, setExistingTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopics().then(setExistingTopics).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const update = (field: keyof QuestionFormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const addTopic = (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed || form.topics.includes(trimmed)) return;
    update('topics', [...form.topics, trimmed]);
    setTopicInput('');
  };

  const removeTopic = (topic: string) => {
    update('topics', form.topics.filter((t) => t !== topic));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.difficulty) errs.difficulty = 'Difficulty is required';
    if (form.topics.length === 0) errs.topics = 'At least one topic is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  const suggestions = existingTopics.filter(
    (t) =>
      !form.topics.includes(t) &&
      t.toLowerCase().includes(topicInput.toLowerCase()) &&
      topicInput.trim().length > 0
  );

  const labelClass = 'block text-sm font-medium text-zinc-700 mb-1';
  const inputClass =
    'w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const errorClass = 'mt-1 text-xs text-red-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {errors.form && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</div>
      )}

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className={inputClass}
          placeholder="e.g. Two Sum"
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={5}
          className={inputClass}
          placeholder="Describe the problem..."
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      {/* Difficulty */}
      <div>
        <label className={labelClass}>Difficulty *</label>
        <select
          value={form.difficulty}
          onChange={(e) => update('difficulty', e.target.value)}
          className={inputClass}
          style={{ backgroundColor: 'white', color: '#18181b' }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {errors.difficulty && <p className={errorClass}>{errors.difficulty}</p>}
      </div>

      {/* Topics */}
      <div>
        <label className={labelClass}>Topics *</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.topics.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {t}
              <button type="button" onClick={() => removeTopic(t)} className="hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTopic(topicInput);
              }
            }}
            className={inputClass}
            placeholder="Type a topic and press Enter"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-md max-h-40 overflow-y-auto">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => addTopic(s)}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.topics && <p className={errorClass}>{errors.topics}</p>}
      </div>

      {/* Examples */}
      <div>
        <label className={labelClass}>Examples</label>
        <textarea
          value={form.examples}
          onChange={(e) => update('examples', e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Input/output examples..."
        />
      </div>

      {/* Pseudocode */}
      <div>
        <label className={labelClass}>Pseudocode / Starter Code</label>
        <textarea
          value={form.pseudocode}
          onChange={(e) => update('pseudocode', e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Starter code shown in the collaboration editor..."
        />
      </div>

      {/* Solution */}
      <div>
        <label className={labelClass}>Solution</label>
        <textarea
          value={form.solution}
          onChange={(e) => update('solution', e.target.value)}
          rows={6}
          className={inputClass}
          placeholder="Model answer shown after the session ends..."
        />
      </div>

      {/* Image URL */}
      <div>
        <label className={labelClass}>Image URL</label>
        <input
          type="text"
          value={form.image_url}
          onChange={(e) => update('image_url', e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
