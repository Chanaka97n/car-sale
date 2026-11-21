import { errorMessage } from "@/lib/api/client";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { toUser, usersApi } from "./usersApi";
import type { User, UserInput } from "./usersTypes";

/** GET /admin/users (all pages). Pass `{ force: true }` to refetch when already loaded. */
export const fetchUsers = createAppAsyncThunk<User[], { force?: boolean } | void>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await usersApi.listAll()).map(toUser);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
  {
    condition: (arg, { getState }) => {
      const { status } = getState().users;
      if (status === "loading") return false;
      return !!(arg && arg.force) || status !== "succeeded";
    },
  },
);

/** GET /admin/users/:id */
export const fetchUserById = createAppAsyncThunk<User, string>(
  "users/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return toUser(await usersApi.get(id));
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** POST /admin/users — returns the user plus a one-time temporary password if none was given. */
export const addUser = createAppAsyncThunk<
  { user: User; temporaryPassword?: string },
  UserInput
>("users/add", async (input, { rejectWithValue }) => {
  try {
    const created = await usersApi.create(input);
    return { user: toUser(created), temporaryPassword: created.temporaryPassword };
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

/** PATCH /admin/users/:id */
export const updateUser = createAppAsyncThunk<User, User & { password?: string }>(
  "users/update",
  async ({ id, name, email, role, status, password }, { rejectWithValue }) => {
    try {
      return toUser(await usersApi.update(id, { name, email, role, status, password }));
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** DELETE /admin/users/:id */
export const deleteUser = createAppAsyncThunk<string, string>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);
