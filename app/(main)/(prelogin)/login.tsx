import sdk from "@/Data/sdk/DataSource";
import { login } from "@/Data/state/account/AccountSlice";
import { useAppDispatch } from "@/hooks/useStore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const codeVerifier = useRef<string>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { url, codeVerifier: verifier } = await sdk.getAuthURL();
        setAuthUrl(url.toString());
        codeVerifier.current = verifier;
      } catch (e) {
        setAuthUrl(null);
      }
    })();
  }, []);

  const shouldLoadCallback = (event: ShouldStartLoadRequest) => {
    const { url } = event;
    const urlObj = new URL(url);
    if (url.startsWith("https://www.hemanth.dev/callback") || urlObj.searchParams.has("code")) {
      console.log("[WebView] Request to Load Denied For :", url);
      const code = urlObj.searchParams.get("code");
      if (code && codeVerifier.current) {
        (async () => {
          console.log("Authorization code:", code);
          try {
            if (codeVerifier.current) {
              await dispatch(login({ authorizationCode: code, codeVerifier: codeVerifier.current })).unwrap();
            }
          } catch (e) {
            // Handle error
            console.error("Error during token exchange:", e);
          }
        })();
      }
      return false;
    }
    console.log("[WebView] Request to Load Allowed For :", url);
    return true;
  };

  if (!authUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: authUrl }}
        style={styles.webview}
        startInLoadingState={true}
        nestedScrollEnabled
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentInset={{ top: insets.top }}
        onShouldStartLoadWithRequest={shouldLoadCallback}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        )}
      />
      <KeyboardAvoidingView behavior="height" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#131313",
  },
  webview: {
    flex: 1,
    backgroundColor: "#131313",
  },
  loadingContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
});
