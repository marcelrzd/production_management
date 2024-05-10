// store.ts

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import tasksReducer from "./features/tasksSlice";
import itemsReducer from "./features/itemsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
