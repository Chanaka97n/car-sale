import type { RequestStatus } from "../../createAppAsyncThunk";

export type UserRole = "admin" | "manager" | "staff";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** YYYY-MM-DD */
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** Optional — if omitted on create, the API generates a temporary password. */
  password?: string;
}

/** Shape returned by the API (timestamps as ISO strings, nulls for empty). */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  temporaryPassword?: string;
}

export interface UsersState {
  users: User[];
  status: RequestStatus;
  error: string | null;
  mutationStatus: RequestStatus;
  mutationError: string | null;
  /** Set after creating a user without a password — show it to the admin once. */
  temporaryCredentials: { email: string; password: string } | null;
}
