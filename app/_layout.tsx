import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/database/FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StatusBar } from 'react-native';
import { useThemeStyles } from '../components/ThemeUtils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const themeStyles = useThemeStyles();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      const isAuthenticated = !!user;
      const isInLogin = segments[0]?.toString() === 'login';

      if (isAuthenticated && isInLogin) {
        router.replace('/(tabs)/HomeScreen');
      } else if (!isAuthenticated && !isInLogin) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router, segments]);

  if (isLoading) {
    return (
      <SafeAreaView style={themeStyles.containerStyle}>
        <Text style={themeStyles.textStyle}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={themeStyles.containerStyle}>
        <StatusBar barStyle={themeStyles.statusBarStyle} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: themeStyles.backgroundColor,
            },
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}