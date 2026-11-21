import type { RootState } from "../../store";

export const selectEnquiries = (state: RootState) =>
  state.enquiries.enquiries;

export const selectNewEnquiriesCount = (state: RootState) =>
  state.enquiries.enquiries.filter((e) => e.status === "new").length;
