import SpotifySDK from "@data/sdk/DataSource";
import {
  Action,
  combineReducers,
  configureStore,
  Middleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import { AppConfig } from "@utils/AppConfig";
import { createLogger } from "redux-logger";
import accountReducer from "./account/AccountSlice";
import libraryReducer from "./library/LibrarySlice";
import playerReducer from "./player/PlayerSlice";

const middlewares: Array<Middleware> = [];

if (__DEV__ && AppConfig.shouldEnableReduxLogs()) {
  const logger = createLogger({
    collapsed: true,
  });

  middlewares.push(logger);
}

function middlewareOptions(options?: Record<string, unknown>) {
  return {
    ...options,
    thunk: { extraArgument: { api: SpotifySDK } },
  };
}

export const store = configureStore({
  reducer: combineReducers({
    account: accountReducer,
    library: libraryReducer,
    player: playerReducer,
  }),
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware(middlewareOptions()).concat(...middlewares);
  },
});

export const setupStore = (
  preloadedState: Partial<RootState>,
  enableLogs: boolean = false
) => {
  return configureStore({
    reducer: combineReducers({
      account: accountReducer,
      library: libraryReducer,
    }),
    preloadedState,
    middleware: enableLogs
      ? (getDefaultMiddleware) =>
          getDefaultMiddleware(middlewareOptions()).concat(...middlewares)
      : undefined,
  });
};

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
