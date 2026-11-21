import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";

/**
 * Pre-typed createAsyncThunk: `getState()` is RootState and `rejectWithValue`
 * carries a user-facing error message string.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
