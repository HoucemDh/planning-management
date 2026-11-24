export interface LoginInput {
  username: string;
  password: string;
}

export interface User_Roles {
  id: string;
  name: string;
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  active: boolean;
  roles: User_Roles[];
}


export interface AuthResponse {
  token: string;
  appUser: AppUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  message: string;
  code?: string;
}