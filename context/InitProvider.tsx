import sdk from "@Data/sdk/DataSource";
import { loadAuthenticationStatus } from "@Data/state/account/AccountActions";
import { useAppInit } from "@hooks/useAppInit.hook";
import { useAppDispatch } from "@hooks/useStore";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { PropsWithChildren } from "react";

export type AuthProviderProps = {};

export function AuthProvider({
  children,
}: PropsWithChildren<AuthProviderProps>) {
  const dispatch = useAppDispatch();

  const isInitialized = useAppInit(async () => {
    try {
      await sdk.initialize();
      await dispatch(loadAuthenticationStatus()).unwrap();
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      SplashScreen.hideAsync();
      return true;
    }
  });

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
