import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import { useUserStore } from '../../constants/userStore';
import { useUserPreferences } from '../../constants/userPreferences';

export default function AssetsScreen() {
  const user = useUserStore((state) => state.user);
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  return (
    <View
      style={[
        globalStyles.container as ViewStyle,
        isDarkMode
          ? (globalStyles.darkContainer as ViewStyle)
          : (globalStyles.lightContainer as ViewStyle),
      ]}
    >
      <Text
        style={
          isDarkMode
            ? (globalStyles.darkText as TextStyle)
            : (globalStyles.lightText as TextStyle)
        }
      >
        Your assets content goes here.
      </Text>
    </View>
  );
}