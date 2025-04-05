import React from 'react';
import { Text, View } from 'react-native';
import { useThemeStyles } from '@/components/ThemeUtils'; // Import the theme hook
import { useUserStore } from '@/constants/userStore';

export default function HomeScreen() {
  const user = useUserStore((state) => state.user);
  const themeStyles = useThemeStyles(); // Access theme-based styles

  return (
    <View style={themeStyles.contentStyle}>
      <Text style={themeStyles.textStyle}>
        Welcome, {user?.firstName} {user?.lastName}!
      </Text>
      <Text style={themeStyles.textStyle}>
        Email: {user?.email}
      </Text>
      <Text style={themeStyles.textStyle}>
        Mobile: {user?.mobile}
      </Text>
    </View>
  );
}