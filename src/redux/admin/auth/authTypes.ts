export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager";
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
  error: string | null;
}
