import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.sessionId = action.payload;
    },
    logout: (state) => {
      state.sessionId = null;
    },
  },
});

const { setSession, logout } = sessionSlice.actions;

export default sessionSlice.reducer;
