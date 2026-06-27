export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'employer' | 'candidate';
  company_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
