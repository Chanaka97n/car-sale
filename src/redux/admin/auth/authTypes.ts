import type { RequestStatus } from "../../createAppAsyncThunk";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
  error: string | null;
  /** Status of the last change-password request. */
  passwordStatus: RequestStatus;
  passwordError: string | null;
}
