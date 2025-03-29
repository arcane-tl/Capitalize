import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native'; // Added ViewStyle and TextStyle
import { globalStyles } from '../../components/css/styles';
import { useUserStore } from '../../constants/userStore';
import { useUserPreferences } from '../../constants/userPreferences';

export default function EventsScreen() {
  const user = useUserStore((state) => state.user);
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  return (
    <View
      style={
        isDarkMode
          ? (globalStyles.darkContent as ViewStyle) // Explicitly cast to ViewStyle
          : (globalStyles.lightContent as ViewStyle) // Explicitly cast to ViewStyle
      }
    >
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle) // Explicitly cast to TextStyle
        }
      >
        Your events content goes here.
      </Text>
    </View>
  );
}