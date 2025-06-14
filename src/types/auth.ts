
export interface Agent {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  is_active: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role_id: string;
  role: Role;
  [key: string]: any; // For all the dynamic profile fields
}
