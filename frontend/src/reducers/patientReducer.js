// src/features/patient/patientSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],  // Stores an array of patients' information
  loading: false,
  error: null,
};

export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientsStart: (state) => {
      state.loading = true;
    },
    fetchPatientsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    },
    fetchPatientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);  // Add a new patient
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(patient => patient.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;  // Update patient details
      }
    },
  },
});

// Export actions
export const { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure, addPatient, updatePatient } = patientSlice.actions;

// Export reducer
export default patientSlice.reducer;
