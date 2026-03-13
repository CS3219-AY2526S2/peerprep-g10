export const API_BASE = {
  QUESTION_SERVICE: process.env.QUESTION_SERVICE_URL ?? 'http://localhost:3003',
  USER_SERVICE: process.env.USER_SERVICE_URL ?? 'http://localhost:3004',
  MATCHING_SERIVCE: process.env.MATCHING_SERVICE_URL ?? `http://localhost:3002`
};
