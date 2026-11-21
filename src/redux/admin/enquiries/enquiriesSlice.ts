import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import {
  addEnquiry,
  deleteEnquiry,
  fetchEnquiries,
  fetchEnquiryById,
  updateEnquiryNotes,
  updateEnquiryStatus,
} from "./enquiriesThunks";
import type { EnquiriesState, Enquiry, EnquiryStatus } from "./enquiriesTypes";

const initialState: EnquiriesState = {
  enquiries: [],
  status: "idle",
  error: null,
  mutationError: null,
  submitStatus: "idle",
  submitError: null,
};

/** Remembers the status before an optimistic change, keyed by request id. */
const previousStatus = new Map<string, EnquiryStatus>();

function upsert(list: Enquiry[], enquiry: Enquiry) {
  const idx = list.findIndex((e) => e.id === enquiry.id);
  if (idx === -1) list.unshift(enquiry);
  else list[idx] = enquiry;
}

const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState,
  reducers: {
    resetEnquirySubmit(state) {
      state.submitStatus = "idle";
      state.submitError = null;
    },
    clearEnquiriesError(state) {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => ({ ...initialState, submitStatus: state.submitStatus }))
      // public submit
      .addCase(addEnquiry.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(addEnquiry.fulfilled, (state) => {
        state.submitStatus = "succeeded";
        // Admin list (if loaded) is now stale — refetch next time it's needed.
        if (state.status === "succeeded") state.status = "idle";
      })
      .addCase(addEnquiry.rejected, (state, { payload }) => {
        state.submitStatus = "failed";
        state.submitError = payload ?? "Could not send your enquiry";
      })
      // admin list
      .addCase(fetchEnquiries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.enquiries = payload;
      })
      .addCase(fetchEnquiries.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Could not load enquiries";
      })
      .addCase(fetchEnquiryById.fulfilled, (state, { payload }) => {
        upsert(state.enquiries, payload);
      })
      // status: optimistic
      .addCase(updateEnquiryStatus.pending, (state, { meta }) => {
        const enq = state.enquiries.find((e) => e.id === meta.arg.id);
        if (enq) {
          previousStatus.set(meta.requestId, enq.status);
          enq.status = meta.arg.status;
        }
        state.mutationError = null;
      })
      .addCase(updateEnquiryStatus.rejected, (state, { meta, payload }) => {
        const prev = previousStatus.get(meta.requestId);
        const enq = state.enquiries.find((e) => e.id === meta.arg.id);
        if (enq && prev) enq.status = prev;
        previousStatus.delete(meta.requestId);
        state.mutationError = payload ?? "Could not update status";
      })
      .addCase(updateEnquiryStatus.fulfilled, (state, { meta, payload }) => {
        previousStatus.delete(meta.requestId);
        upsert(state.enquiries, payload);
      })
      .addCase(updateEnquiryNotes.fulfilled, (state, { payload }) => {
        upsert(state.enquiries, payload);
      })
      .addCase(deleteEnquiry.fulfilled, (state, { payload }) => {
        state.enquiries = state.enquiries.filter((e) => e.id !== payload);
      })
      .addMatcher(isAnyOf(updateEnquiryNotes.pending, deleteEnquiry.pending), (state) => {
        state.mutationError = null;
      })
      .addMatcher(
        isAnyOf(updateEnquiryNotes.rejected, deleteEnquiry.rejected),
        (state, { payload }) => {
          state.mutationError = payload ?? "Request failed";
        },
      );
  },
});

export const { resetEnquirySubmit, clearEnquiriesError } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;
