import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../state/account/AccountSlice";

export const store = configureStore({
  reducer: combineReducers({
    account: accountReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
