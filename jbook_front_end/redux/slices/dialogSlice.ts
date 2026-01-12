import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  editPostDialog: {
    status: boolean;
    post_id: string;
  };
  layoutSidebar: boolean;
}

const initialState = {
  layoutSidebar: true,
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
    setLayoutSidebar: (state, action) => {
      state.layoutSidebar = action.payload;
    },
  },
});

export const { setEditPostDialog, setLayoutSidebar } = dialogSlice.actions;

export default dialogSlice.reducer;
