export const API_BASE = {
  QUESTION_SERVICE: process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL ?? 'http://localhost:3003',
  USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? 'http://localhost:3004',
  MATCHING_SERIVCE: process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL ?? 'http://localhost:3002',
  COLLAB_SERVICE: process.env.NEXT_PUBLIC_COLLAB_SERVICE_URL ?? 'http://localhost:3001'
};
