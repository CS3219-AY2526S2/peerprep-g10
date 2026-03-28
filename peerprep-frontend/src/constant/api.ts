export const API_BASE = {
  QUESTION_SERVICE: process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL ?? '/api/question',
  USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? '/api/user',
  MATCHING_SERVICE: process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL ?? '/api/matching',
  COLLAB_SERVICE: process.env.NEXT_PUBLIC_COLLAB_BACKEND_URL ?? '/api/collab',
};
