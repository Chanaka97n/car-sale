import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "./authTypes";

const STORAGE_KEY = "apex_admin_auth";

const MOCK_ADMIN: AuthUser = {
  id: "1",
  email: "admin@apexselect.co.uk",
  name: "Admin User",
  role: "admin",
};

function loadPersistedAuth(): AuthState {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const user: AuthUser = JSON.parse(stored);
      return { user, isAuthenticated: true, status: "idle", error: null };
    }
  } catch {}
  return { user: null, isAuthenticated: false, status: "idle", error: null };
}

function persistAuth(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadPersistedAuth,
  reducers: {
    loginStart(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.status = "idle";
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      persistAuth(action.payload);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      persistAuth(null);
    },
  },
});

export function login(email: string, password: string) {
  return (dispatch: (action: ReturnType<typeof authSlice.actions.loginStart | typeof authSlice.actions.loginSuccess | typeof authSlice.actions.loginFailure>) => void) => {
    dispatch(authSlice.actions.loginStart());
    setTimeout(() => {
      if (email === "admin@apexselect.co.uk" && password === "admin123") {
        dispatch(authSlice.actions.loginSuccess(MOCK_ADMIN));
      } else {
        dispatch(authSlice.actions.loginFailure("Invalid email or password"));
      }
    }, 800);
  };
}

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
