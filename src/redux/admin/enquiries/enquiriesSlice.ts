import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockEnquiries } from "./enquiriesMockData";
import type { Enquiry, EnquiriesState, EnquiryStatus } from "./enquiriesTypes";

const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState: {
    enquiries: mockEnquiries,
    status: "idle",
  } as EnquiriesState,
  reducers: {
    addEnquiry(state, action: PayloadAction<Omit<Enquiry, "id" | "createdAt" | "status">>) {
      state.enquiries.unshift({
        ...action.payload,
        id: `enq-${Date.now()}`,
        status: "new",
        createdAt: new Date().toISOString().split("T")[0],
      });
    },
    updateEnquiryStatus(
      state,
      action: PayloadAction<{ id: string; status: EnquiryStatus }>
    ) {
      const enq = state.enquiries.find((e) => e.id === action.payload.id);
      if (enq) enq.status = action.payload.status;
    },
    deleteEnquiry(state, action: PayloadAction<string>) {
      state.enquiries = state.enquiries.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addEnquiry, updateEnquiryStatus, deleteEnquiry } =
  enquiriesSlice.actions;
export default enquiriesSlice.reducer;
