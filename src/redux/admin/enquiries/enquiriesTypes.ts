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
  createdAt: string;
}

export interface EnquiriesState {
  enquiries: Enquiry[];
  status: "idle" | "loading";
}
