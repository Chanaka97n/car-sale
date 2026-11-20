import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockUsers } from "./usersMockData";
import type { User, UsersState } from "./usersTypes";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: mockUsers,
    status: "idle",
  } as UsersState,
  reducers: {
    addUser(state, action: PayloadAction<Omit<User, "id" | "createdAt">>) {
      state.users.push({
        ...action.payload,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split("T")[0],
      });
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
