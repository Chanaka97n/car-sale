import { errorMessage } from "@/lib/api/client";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { enquiriesApi, toEnquiry } from "./enquiriesApi";
import type { Enquiry, EnquiryInput, EnquiryStatus } from "./enquiriesTypes";

/** POST /enquiries — public site forms (contact, test drive, vehicle, part exchange). */
export const addEnquiry = createAppAsyncThunk<{ id: string }, EnquiryInput>(
  "enquiries/submit",
  async (input, { rejectWithValue }) => {
    try {
      const { id } = await enquiriesApi.submit(input);
      return { id };
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not send your enquiry. Please try again."));
    }
  },
);

/** GET /admin/enquiries (all pages). Pass `{ force: true }` to refetch when already loaded. */
export const fetchEnquiries = createAppAsyncThunk<Enquiry[], { force?: boolean } | void>(
  "enquiries/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await enquiriesApi.listAll()).map(toEnquiry);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
  {
    condition: (arg, { getState }) => {
      const { status } = getState().enquiries;
      if (status === "loading") return false;
      return !!(arg && arg.force) || status !== "succeeded";
    },
  },
);

/** GET /admin/enquiries/:id */
export const fetchEnquiryById = createAppAsyncThunk<Enquiry, string>(
  "enquiries/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return toEnquiry(await enquiriesApi.get(id));
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** PATCH /admin/enquiries/:id { status } — applied optimistically, rolled back on failure. */
export const updateEnquiryStatus = createAppAsyncThunk<
  Enquiry,
  { id: string; status: EnquiryStatus }
>("enquiries/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return toEnquiry(await enquiriesApi.update(id, { status }));
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

/** PATCH /admin/enquiries/:id { internalNotes } */
export const updateEnquiryNotes = createAppAsyncThunk<
  Enquiry,
  { id: string; internalNotes: string }
>("enquiries/updateNotes", async ({ id, internalNotes }, { rejectWithValue }) => {
  try {
    return toEnquiry(await enquiriesApi.update(id, { internalNotes }));
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

/** DELETE /admin/enquiries/:id */
export const deleteEnquiry = createAppAsyncThunk<string, string>(
  "enquiries/delete",
  async (id, { rejectWithValue }) => {
    try {
      await enquiriesApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);
