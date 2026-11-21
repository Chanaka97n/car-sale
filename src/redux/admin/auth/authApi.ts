import { api } from "@/lib/api/client";
import type { AuthUser, LoginResponse } from "./authTypes";

/** Backend: car-sale-backend/src/modules/auth/auth.controller.ts */
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }, { auth: false }),

  me: () => api.get<AuthUser>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch<void>("/auth/password", { currentPassword, newPassword }),
};
