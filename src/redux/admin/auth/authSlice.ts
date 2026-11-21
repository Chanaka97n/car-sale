import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken } from "@/lib/api/client";
import { changePassword, fetchCurrentUser, login } from "./authThunks";
import type { AuthState, AuthUser } from "./authTypes";

const STORAGE_KEY = "apex_admin_auth";

interface PersistedAuth {
  token: string;
  user: AuthUser;
}

const loggedOut: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  passwordStatus: "idle",
  passwordError: null,
};

function loadPersistedAuth(): AuthState {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<PersistedAuth>;
      // Older builds stored only the user (no token) — treat those as logged out.
      if (parsed.token && parsed.user) {
        setAuthToken(parsed.token);
        return { ...loggedOut, user: parsed.user, token: parsed.token, isAuthenticated: true };
      }
    }
  } catch {}
  return loggedOut;
}

function persistAuth(data: PersistedAuth | null) {
  try {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadPersistedAuth,
  reducers: {
    logout() {
      setAuthToken(null);
      persistAuth(null);
      return loggedOut;
    },
    clearAuthError(state) {
      state.error = null;
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.user = payload.user;
        state.token = payload.accessToken;
        state.isAuthenticated = true;
        setAuthToken(payload.accessToken);
        persistAuth({ token: payload.accessToken, user: payload.user });
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Login failed";
      })
      // me — refresh name/role in case an admin changed them
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        if (state.token) persistAuth({ token: state.token, user: payload });
      })
      // change password
      .addCase(changePassword.pending, (state) => {
        state.passwordStatus = "loading";
        state.passwordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.passwordStatus = "failed";
        state.passwordError = payload ?? "Could not change password";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
