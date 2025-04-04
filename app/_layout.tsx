import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/database/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StatusBar, ViewStyle, TextStyle, StatusBarStyle } from 'react-native';
import { globalStyles, colors, customBarStyles } from '../components/css/styles';
import { getStyle } from '@/components/themeUtils';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);

  // Access user preferences and system theme
  const textStyle = getStyle('Text', globalStyles);
  const containerStyle = getStyle('Container', globalStyles);
  const customBarStyle = getStyle('StatusBar', customBarStyles);
  const customBackgroundColor = getStyle('Background', colors);

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
          globalStyles.safeArea as ViewStyle,
          containerStyle as ViewStyle,
        ]}
      >
        <Text
          style={
            textStyle as TextStyle
          }
        >
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[
        globalStyles.safeArea as ViewStyle,
        containerStyle as ViewStyle,
      ]}
    >
      <StatusBar barStyle={customBarStyle as StatusBarStyle} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: customBackgroundColor,
            },
          }}
        />
    </View>
  );
}