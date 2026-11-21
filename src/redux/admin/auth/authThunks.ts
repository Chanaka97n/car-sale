import { errorMessage } from "@/lib/api/client";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { authApi } from "./authApi";
import type { AuthUser, LoginResponse } from "./authTypes";

/** POST /auth/login */
export const login = createAppAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authApi.login(email, password);
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Invalid email or password"));
    }
  },
);

/** GET /auth/me — re-validates a persisted session (401 logs out via the client). */
export const fetchCurrentUser = createAppAsyncThunk<AuthUser, void>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
  { condition: (_, { getState }) => !!getState().auth.token },
);

/** PATCH /auth/password */
export const changePassword = createAppAsyncThunk<
  void,
  { currentPassword: string; newPassword: string }
>("auth/changePassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    await authApi.changePassword(currentPassword, newPassword);
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});
