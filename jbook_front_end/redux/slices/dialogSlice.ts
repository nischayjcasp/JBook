import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  editPostDialog: {
    status: boolean;
    post_id: string;
  };
}

const initialState = {
  editPostDialog: {
    status: false,
    post_id: "",
  },
};

const dialogSlice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    setEditPostDialog: (state, action) => {
      state.editPostDialog = action.payload;
    },
  },
});

export const { setEditPostDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
