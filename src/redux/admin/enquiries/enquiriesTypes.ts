import type { RequestStatus } from "../../createAppAsyncThunk";

export type EnquiryType =
  | "vehicle"
  | "test-drive"
  | "finance"
  | "part-exchange"
  | "general";

export type EnquiryStatus = "new" | "in-progress" | "resolved" | "archived";

export interface Enquiry {
  id: string;
  type: EnquiryType;
  status: EnquiryStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  vehicleId?: string;
  vehicleLabel?: string;
  preferredDate?: string;
  preferredTime?: string;
  marketingConsent: boolean;
  /** YYYY-MM-DD */
  createdAt: string;
  // Part exchange
  pxRegistration?: string;
  pxMileage?: number;
  pxCondition?: string;
  // Finance
  financeAmount?: number;
  financeDeposit?: number;
  financeTermMonths?: number;
  internalNotes?: string;
}

/** What the public forms submit. `vehicleLabel` is display-only and not sent. */
export type EnquiryInput = Omit<Enquiry, "id" | "createdAt" | "status" | "internalNotes" | "email" | "message"> & {
  email?: string;
  message?: string;
};

/** Shape returned by the API. */
export interface ApiEnquiry {
  id: string;
  type: EnquiryType;
  status: EnquiryStatus;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  message: string | null;
  marketingOptIn: boolean;
  vehicleId: string | null;
  vehicle?: { id: string; make: string; model: string; variant: string; image?: string } | null;
  preferredDate: string | null;
  preferredTime: string | null;
  pxRegistration: string | null;
  pxMileage: number | null;
  pxCondition: string | null;
  financeAmount: number | null;
  financeDeposit: number | null;
  financeTermMonths: number | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiriesState {
  enquiries: Enquiry[];
  status: RequestStatus;
  error: string | null;
  mutationError: string | null;
  /** Public form submission state. */
  submitStatus: RequestStatus;
  submitError: string | null;
}
