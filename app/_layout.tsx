import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();
const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    //checking the user's current screen
    const inAuthGroup = segments[0] === "(auth)";
    if (session && inAuthGroup) {
      router.replace("/(home)");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [session, initialized, segments, router]);

  if (initialized) {
    SplashScreen.hideAsync();
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
