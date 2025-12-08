import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mergerActiveStep: 4,
  primaryAcc: {
    email: null,
  },
  secondaryAcc: [
    {
      email: null,
    },
  ],
};

const mergerSlice = createSlice({
  name: "merger",
  initialState,
  reducers: {
    mergerNext: (state) => {
      state.mergerActiveStep = state.mergerActiveStep + 1;
    },
    mergerPrev: (state) => {
      state.mergerActiveStep = state.mergerActiveStep - 1;
    },
    setPrimaryAccData: (state, action) => {
      state.primaryAcc = action.payload;
    },
    setSecondaryAccData: (state, action) => {
      state.secondaryAcc = action.payload;
    },
  },
});

export const {
  mergerNext,
  mergerPrev,
  setPrimaryAccData,
  setSecondaryAccData,
} = mergerSlice.actions;
export default mergerSlice.reducer;
