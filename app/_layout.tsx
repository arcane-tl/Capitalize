import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/database/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StatusBar } from 'react-native';
import { globalStyles } from '../src/css/styles';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      const isAuthenticated = !!user;
      const isInLogin = segments[0] === 'login';

      if (isAuthenticated && isInLogin) {
        router.replace('/(tabs)/home');
      } else if (!isAuthenticated && !isInLogin) {
        router.replace('/index');
      }
    });

    return () => unsubscribe();
  }, [router, segments]);

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}