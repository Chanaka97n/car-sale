import { api, compact, fetchAllPages, type Paginated, type Query } from "@/lib/api/client";
import type { ApiEnquiry, Enquiry, EnquiryInput, EnquiryStatus, EnquiryType } from "./enquiriesTypes";

const opt = <T>(v: T | null | undefined) => (v === null ? undefined : v);

export function toEnquiry(e: ApiEnquiry): Enquiry {
  return {
    id: e.id,
    type: e.type,
    status: e.status,
    firstName: e.firstName,
    lastName: e.lastName ?? "",
    email: e.email ?? "",
    phone: e.phone,
    message: e.message ?? "",
    vehicleId: opt(e.vehicleId),
    vehicleLabel: e.vehicle
      ? [e.vehicle.make, e.vehicle.model, e.vehicle.variant].filter(Boolean).join(" ")
      : undefined,
    preferredDate: opt(e.preferredDate),
    preferredTime: opt(e.preferredTime),
    marketingConsent: e.marketingOptIn,
    createdAt: e.createdAt.slice(0, 10),
    pxRegistration: opt(e.pxRegistration),
    pxMileage: opt(e.pxMileage),
    pxCondition: opt(e.pxCondition),
    financeAmount: opt(e.financeAmount),
    financeDeposit: opt(e.financeDeposit),
    financeTermMonths: opt(e.financeTermMonths),
    internalNotes: opt(e.internalNotes),
  };
}

/** Frontend form payload → backend CreateEnquiryDto. */
export function toCreateEnquiryBody(input: EnquiryInput) {
  return compact({
    type: input.type,
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim(),
    email: input.email?.trim(),
    phone: input.phone.trim(),
    message: input.message,
    marketingOptIn: input.marketingConsent,
    vehicleId: input.vehicleId,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    pxRegistration: input.pxRegistration,
    pxMileage: input.pxMileage,
    pxCondition: input.pxCondition,
    financeAmount: input.financeAmount,
    financeDeposit: input.financeDeposit,
    financeTermMonths: input.financeTermMonths,
  });
}

export interface EnquiriesQuery extends Query {
  type?: EnquiryType;
  status?: EnquiryStatus;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Backend: modules/enquiries/enquiries.controller.ts (public POST)
 *          modules/enquiries/admin-enquiries.controller.ts (admin inbox).
 */
export const enquiriesApi = {
  submit: (input: EnquiryInput) =>
    api.post<{ id: string; type: EnquiryType; createdAt: string }>(
      "/enquiries",
      toCreateEnquiryBody(input),
      { auth: false },
    ),

  list: (query: EnquiriesQuery = {}) =>
    api.get<Paginated<ApiEnquiry>>("/admin/enquiries", query),

  listAll: (query: EnquiriesQuery = {}) => fetchAllPages<ApiEnquiry>("/admin/enquiries", query),

  get: (id: string) => api.get<ApiEnquiry>(`/admin/enquiries/${id}`),

  update: (id: string, body: { status?: EnquiryStatus; internalNotes?: string }) =>
    api.patch<ApiEnquiry>(`/admin/enquiries/${id}`, body),

  remove: (id: string) => api.delete(`/admin/enquiries/${id}`),
};
