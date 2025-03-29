import React from 'react';
import { Text, View, StyleSheet, Switch, ViewStyle, TextStyle } from 'react-native'; // Added ViewStyle and TextStyle
import { globalStyles } from '../components/css/styles';
import { useUserPreferences } from '../constants/userPreferences'; // Import the theme store

export default function SettingsScreen() {
  const { theme, setTheme } = useUserPreferences(); // Access theme and setTheme from the store
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark'); // Toggle between light and dark modes
  };

  return (
    <View
      style={[
        globalStyles.container as ViewStyle, // Explicitly cast to ViewStyle
        isDarkMode
          ? (globalStyles.darkContainer as ViewStyle) // Explicitly cast to ViewStyle
          : (globalStyles.lightContainer as ViewStyle), // Explicitly cast to ViewStyle
      ]}
    >
      <Text
        style={[
          globalStyles.text as TextStyle, // Explicitly cast to TextStyle
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
        ]}
      >
        Theme
      </Text>
      <View style={styles.switchContainer}>
        <Text
          style={[
            globalStyles.text as TextStyle, // Explicitly cast to TextStyle
            isDarkMode
              ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
              : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
          ]}
        >
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  } as ViewStyle,
});