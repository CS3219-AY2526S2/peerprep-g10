export type QuestionSnapshot = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  examples: string;
  pseudocode: string;
  solution: string;
};

export type Attempt = {
  id: string;
  roomId: string;
  userId: string;
  partnerId: string;
  questionId: string;
  questionSnapshot: QuestionSnapshot;
  code: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
};

export type AttemptWithDetails = Attempt & {
  partner:
    | {
        id?: string;
        username?: string | null;
        profile_icon?: string | null;
      }
    | null;
  question: QuestionSnapshot;
};