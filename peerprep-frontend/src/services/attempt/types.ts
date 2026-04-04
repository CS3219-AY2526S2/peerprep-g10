import { Question } from '@/src/services/types';

export type Attempt = {
  id: string;
  roomId: string;
  userId: string;
  partnerId: string;
  questionId: string;
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
  question: Question;
};