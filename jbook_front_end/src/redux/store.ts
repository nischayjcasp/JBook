import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "@/src/redux/slices/loaderSlices";
import mergerSlice from "@/src/redux/slices/mergerSlice";
import sessionSlice from "@/src/redux/slices/sessionSlice";

export const ReduxStore = configureStore({
  reducer: {
    mainLoader: loaderSlice,
    merger: mergerSlice,
    session: sessionSlice,
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
