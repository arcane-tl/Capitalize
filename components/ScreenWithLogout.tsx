// components/ScreenWithLogout.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenWithLogout({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: insets.top + 10, right: 10, zIndex: 1 }}>
        <TouchableOpacity onPress={handleLogout}>
          <Text>{'⏏️'}</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}