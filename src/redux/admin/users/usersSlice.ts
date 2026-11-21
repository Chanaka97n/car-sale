import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import { addUser, deleteUser, fetchUserById, fetchUsers, updateUser } from "./usersThunks";
import type { User, UsersState } from "./usersTypes";

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
  temporaryCredentials: null,
};

function upsert(users: User[], user: User) {
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) users.unshift(user);
  else users[idx] = user;
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearTemporaryCredentials(state) {
      state.temporaryCredentials = null;
    },
    clearUsersError(state) {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.users = payload;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Could not load users";
      })
      .addCase(fetchUserById.fulfilled, (state, { payload }) => {
        upsert(state.users, payload);
      })
      .addCase(addUser.fulfilled, (state, { payload }) => {
        state.mutationStatus = "succeeded";
        upsert(state.users, payload.user);
        state.temporaryCredentials = payload.temporaryPassword
          ? { email: payload.user.email, password: payload.temporaryPassword }
          : null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.mutationStatus = "succeeded";
        upsert(state.users, payload);
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.mutationStatus = "succeeded";
        state.users = state.users.filter((u) => u.id !== payload);
      })
      .addMatcher(isAnyOf(addUser.pending, updateUser.pending, deleteUser.pending), (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addMatcher(
        isAnyOf(addUser.rejected, updateUser.rejected, deleteUser.rejected),
        (state, { payload }) => {
          state.mutationStatus = "failed";
          state.mutationError = payload ?? "Request failed";
        },
      );
  },
});

export const { clearTemporaryCredentials, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
