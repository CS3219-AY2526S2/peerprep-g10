export const ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  USER_PROFILE: '/user/profile',
  USER: '/user',
  ROOM: (roomId: string, userId: string) => `/collaboration/${roomId}?user=${userId}`,
  ADMIN: '/admin',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_TAB: (tab: 'questions' | 'users') => `/admin?tab=${tab}`,
  ADMIN_CREATE_ADMIN: '/admin/create-admin',
  ADMIN_QUESTIONS_CREATE: '/admin/questions/create',
  ADMIN_QUESTIONS_EDIT: (id: number) => `/admin/questions/${id}/edit`,
};