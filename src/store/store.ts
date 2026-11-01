import { configureStore } from "@reduxjs/toolkit";

import { catalogApi } from "@/infrastructure/http/catalogApi";
import { productUiReducer } from "@/store/productUiSlice";

export function createAppStore() {
  return configureStore({
    reducer: {
      productUi: productUiReducer,
      [catalogApi.reducerPath]: catalogApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(catalogApi.middleware),
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
