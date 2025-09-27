import { CustomDrawerContent } from "@/components/layout/CustomDrawerView";
import { useAppSelector } from "@/hooks/useStore";
import { Drawer } from "expo-router/drawer";

export default function _layout() {
  const isAuthenticated = useAppSelector(
    (state) => state.account.auth.isAuthenticated
  );

  return (
    <Drawer
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
    </Drawer>
  );
}
