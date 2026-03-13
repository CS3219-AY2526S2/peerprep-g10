export interface User {
  id: number;
  username: string;
  email: string;
  access_role: 'admin' | 'user';
  profile_icon: string;
  is_verified: boolean;
  created_at: string;
}