import { useAppSelector } from "@/hooks/useStore";
import { Stack } from "expo-router";

export default function _layout() {
  const isAuthenticated = useAppSelector(
    (state) => state.account.auth.isAuthenticated
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(sidebar)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(prelogin)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
