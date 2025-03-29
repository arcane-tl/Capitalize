import React from 'react';
import { Text, View } from 'react-native';
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
        globalStyles.container,
        isDarkMode ? globalStyles.darkContent : globalStyles.lightContent, // Dynamic background
      ]}
    >
      <Text style={isDarkMode ? globalStyles.darkText : globalStyles.lightText}>
        Your assets content goes here.
      </Text>
    </View>
  );
}