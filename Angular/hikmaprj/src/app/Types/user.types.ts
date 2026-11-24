export interface RoleInput {
  name: string;
}

export interface RolePayload {
  id: string;
  name: string;
  message: string;
}

export interface UserInput {
  username: string;
  email: string;
  password : string;
  roleIds: string[];
}

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  roles: RolePayload[];
  message: string;
  active?: boolean; // Added to track user active state
}