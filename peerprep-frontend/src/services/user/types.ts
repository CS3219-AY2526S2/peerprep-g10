export interface User {
  id: number;
  username: string;
  email: string;
  access_role: Role;
  profile_icon: string;
  is_verified: boolean;
  is_banned: boolean;
  created_at: string;
}

export type UpdateProfileData = {
  username: string;
  email: string;
  password: string;
};

export type Role = 'admin' | 'user';