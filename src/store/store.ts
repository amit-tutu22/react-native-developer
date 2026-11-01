import { configureStore } from "@reduxjs/toolkit";

import { productUiReducer } from "@/store/productUiSlice";

export const store = configureStore({
  reducer: {
    productUi: productUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
