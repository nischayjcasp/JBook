import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "@/src/redux/slices/loaderSlices";
import mergerSlice from "@/src/redux/slices/mergerSlice";

export const ReduxStore = configureStore({
  reducer: {
    mainLoader: loaderSlice,
    merger: mergerSlice,
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
