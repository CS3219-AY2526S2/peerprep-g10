export interface User {
  id: number;
  username: string;
  email: string;
  access_role: 'admin' | 'user';
  profile_icon: string;
  is_verified: boolean;
  created_at: string;
}

export type UpdateProfileData = {
  username: string;
  email: string;
  password: string;
};