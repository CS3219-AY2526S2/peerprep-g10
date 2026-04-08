export type QuestionSnapshot = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  examples: string;
  pseudocode: string;
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
  partner: {
    id: string;
    username: string;
    profile_icon: string;
  };
  question: QuestionSnapshot;
};