import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "@/redux/slices/loaderSlices";
import mergerSlice from "@/redux/slices/mergerSlice";
import userSlice from "@/redux/slices/userSlice";
import dialogSlice from "@/redux/slices/dialogSlice";

export const ReduxStore = configureStore({
  reducer: {
    mainLoader: loaderSlice,
    merger: mergerSlice,
    user: userSlice,
    dialogs: dialogSlice,
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
