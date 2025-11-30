import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import accountReducer from "../state/account/AccountSlice";
import libraryReducer from "../state/library/LibrarySlice";

export const store = configureStore({
  reducer: combineReducers({
    account: accountReducer,
    library: libraryReducer,
  }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
