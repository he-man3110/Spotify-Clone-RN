import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

export const useAppInit = (init: () => Promise<boolean>) => {
  // Your initialization logic here
  const [initialized, setInitialized] = useState(false);

  const [fontLoaded] = useFonts({
    SpaceMono: require("@assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    (async () => {
        const result = await init();
        console.log("App initialization Done :", result);
        setInitialized(result);
    })();
  }, []);

  return initialized && fontLoaded;
}