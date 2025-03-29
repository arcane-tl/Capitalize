import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import { useUserPreferences } from '../../constants/userPreferences';

export default function EventsScreen() {
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  return (
    <View
      style={
        isDarkMode
          ? (globalStyles.darkContent as ViewStyle)
          : (globalStyles.lightContent as ViewStyle)
      }
    >
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle)
            : (globalStyles.lightText as TextStyle)
        }
      >
        Your events content goes here.
      </Text>
    </View>
  );
}