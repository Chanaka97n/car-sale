import type { RootState } from "../../store";

export const selectEnquiries = (state: RootState) => state.enquiries.enquiries;

export const selectNewEnquiriesCount = (state: RootState) =>
  state.enquiries.enquiries.filter((e) => e.status === "new").length;

export const selectEnquiriesStatus = (state: RootState) => state.enquiries.status;

/** Load error or last mutation error, whichever is set. */
export const selectEnquiriesError = (state: RootState) =>
  state.enquiries.mutationError ?? state.enquiries.error;

export const selectEnquirySubmitStatus = (state: RootState) => state.enquiries.submitStatus;
export const selectEnquirySubmitError = (state: RootState) => state.enquiries.submitError;
