export interface Question {
  id: number;
  title: string;
  description: string;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  examples: string;
  pseudocode: string;
  image_url: string;
  created_at: string;
}

export type QuestionFormData = Omit<Question, 'id' | 'created_at'>;
