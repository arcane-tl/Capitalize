import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native'; // Added ViewStyle and TextStyle
import { globalStyles } from '../../components/css/styles';
import { useUserStore } from '../../constants/userStore';
import { useUserPreferences } from '../../constants/userPreferences'; // Import theme store
import { getStyle } from '@/components/themeUtils'; // Import getStyle function

export default function HomeScreen() {
  const user = useUserStore((state) => state.user);
  const { theme } = useUserPreferences(); // Access the theme preference
  
  return (
    <View
      style={[
        globalStyles.screenContainer as ViewStyle,
        getStyle('Content', globalStyles) as ViewStyle,
      ]}
    >
      <Text
        style={
          getStyle('Text', globalStyles) as TextStyle
        }
      >
        Welcome, {user?.firstName} {user?.lastName}!
      </Text>
      <Text
        style={
          getStyle('Text', globalStyles) as TextStyle
        }
      >
        Email: {user?.email}
      </Text>
      <Text
        style={
          getStyle('Text', globalStyles) as TextStyle
        }
      >
        Mobile: {user?.mobile}
      </Text>
    </View>
  );
}