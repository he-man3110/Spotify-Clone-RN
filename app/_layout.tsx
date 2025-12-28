import { AuthProvider } from "@context/InitProvider";
import AppThemeProvider from "@context/ThemeProvider";
import { store } from "@data/state/store";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Provider } from "react-redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <GestureHandlerRootView>
        <Provider store={store}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(main)" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
        </Provider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </AppThemeProvider>
  );
}
