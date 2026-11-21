import { api, compact, fetchAllPages, type Paginated, type Query } from "@/lib/api/client";
import type { ApiUser, User, UserInput } from "./usersTypes";

export function toUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt.slice(0, 10),
    lastLoginAt: u.lastLoginAt ?? undefined,
  };
}

export interface UsersQuery extends Query {
  search?: string;
  role?: User["role"];
  status?: User["status"];
  page?: number;
  limit?: number;
}

/** Backend: modules/users/admin-users.controller.ts (admin role only). */
export const usersApi = {
  list: (query: UsersQuery = {}) => api.get<Paginated<ApiUser>>("/admin/users", query),

  listAll: (query: UsersQuery = {}) => fetchAllPages<ApiUser>("/admin/users", query),

  get: (id: string) => api.get<ApiUser>(`/admin/users/${id}`),

  create: (input: UserInput) => api.post<ApiUser>("/admin/users", compact(input)),

  update: (id: string, input: Partial<UserInput>) =>
    api.patch<ApiUser>(`/admin/users/${id}`, compact(input)),

  remove: (id: string) => api.delete(`/admin/users/${id}`),
};
