import { createAsyncThunk } from "@reduxjs/toolkit";
import { mockVehicles } from "./vehiclesMockData";
import type { Vehicle } from "./vehiclesTypes";

export const fetchVehicles = createAsyncThunk<Vehicle[]>(
  "vehicles/fetchVehicles",
  async () => {
    // Simulates an API call — replace with real fetch when backend is ready
    return mockVehicles;
  },
);
