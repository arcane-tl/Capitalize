import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/database/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StatusBar, Appearance } from 'react-native';
import { globalStyles } from '../components/css/styles';
import { useUserPreferences } from '../constants/userPreferences';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);

  // Access user preferences and system theme
  const { theme: userTheme } = useUserPreferences();
  const systemTheme = Appearance.getColorScheme();
  const isDarkMode = userTheme === 'dark' || (userTheme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      const isAuthenticated = !!user;
      const isInLogin = segments[0]?.toString() === 'login';

      if (isAuthenticated && isInLogin) {
        router.replace('/(tabs)/home');
      } else if (!isAuthenticated && !isInLogin) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router, segments]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          globalStyles.safeArea,
          isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer,
        ]}
      >
        <Text style={isDarkMode ? globalStyles.darkText : globalStyles.lightText}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[
        globalStyles.safeArea,
        isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode ? '#000' : '#fff',
          },
        }}
      />
    </View>
  );
}