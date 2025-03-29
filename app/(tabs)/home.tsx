import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native'; // Added ViewStyle and TextStyle
import { globalStyles } from '../../components/css/styles';
import { useUserStore } from '../../constants/userStore';
import { useUserPreferences } from '../../constants/userPreferences'; // Import theme store

export default function HomeScreen() {
  const user = useUserStore((state) => state.user);
  const { theme } = useUserPreferences(); // Access the theme preference
  const isDarkMode = theme === 'dark';

  return (
    <View
      style={[
        globalStyles.container as ViewStyle, // Explicitly cast to ViewStyle
        isDarkMode
          ? (globalStyles.darkContent as ViewStyle) // Explicitly cast to ViewStyle
          : (globalStyles.lightContent as ViewStyle), // Explicitly cast to ViewStyle
      ]}
    >
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle) // Explicitly cast to TextStyle
        }
      >
        Welcome, {user?.firstName} {user?.lastName}!
      </Text>
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle) // Explicitly cast to TextStyle
        }
      >
        Email: {user?.email}
      </Text>
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle) // Explicitly cast to TextStyle
        }
      >
        Mobile: {user?.mobile}
      </Text>
    </View>
  );
}