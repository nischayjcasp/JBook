import { Percent } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mergingProgress: {
    isMerging: false,
    totalPost: 0,
    mergedPost: 0,
  },
  mergerActiveStep: 6,
  primaryAcc: {
    email: null,
    isVerified: false,
  },
  secondaryAcc: {
    email: null,
    isVerified: false,
  },
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
    mergerReset: (state) => {
      state.mergerActiveStep = 1;
    },
    mergeSuccess: (state) => {
      state.mergerActiveStep = 3;
    },
    mergeFailure: (state) => {
      state.mergerActiveStep = 4;
    },
    setPrimaryAccData: (state, action) => {
      state.primaryAcc = action.payload;
    },
    setSecondaryAccData: (state, action) => {
      state.secondaryAcc = action.payload;
    },
    startMerging: (state, action) => {
      const { mergedPost, totalPost } = action.payload;
      state.mergingProgress.isMerging = true;
      state.mergingProgress.mergedPost = mergedPost;
      state.mergingProgress.totalPost = totalPost;
    },
    stopMerging: (state, action) => {
      const { mergedPost, totalPost } = action.payload;
      state.mergingProgress.isMerging = false;
      state.mergingProgress.mergedPost = mergedPost;
      state.mergingProgress.totalPost = totalPost;
    },
    updateMergingProcess: (state, action) => {
      const { mergedPost } = action.payload;
      console.log("mergedPost:Redux: ", mergedPost);
      state.mergingProgress.mergedPost += mergedPost;
    },
  },
});

export const {
  mergerNext,
  mergerPrev,
  mergerReset,
  mergeSuccess,
  mergeFailure,
  setPrimaryAccData,
  setSecondaryAccData,
  startMerging,
  stopMerging,
  updateMergingProcess,
} = mergerSlice.actions;
export default mergerSlice.reducer;
