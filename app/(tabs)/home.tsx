import React from 'react';
import { Text, View } from 'react-native';
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
        globalStyles.container,
        isDarkMode ? globalStyles.darkContent : globalStyles.lightContent, // Dynamic background
      ]}
    >
      <Text style={isDarkMode ? globalStyles.darkText : globalStyles.lightText}>
        Welcome, {user?.firstName} {user?.lastName}!
      </Text>
      <Text style={isDarkMode ? globalStyles.darkText : globalStyles.lightText}>
        Email: {user?.email}
      </Text>
      <Text style={isDarkMode ? globalStyles.darkText : globalStyles.lightText}>
        Mobile: {user?.mobile}
      </Text>
    </View>
  );
}