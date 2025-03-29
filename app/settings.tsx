import React from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
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
        globalStyles.container,
        isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer,
      ]}
    >
      <Text
        style={[
          globalStyles.text,
          isDarkMode ? globalStyles.darkText : globalStyles.lightText,
        ]}
      >
        Theme
      </Text>
      <View style={styles.switchContainer}>
        <Text
          style={[
            globalStyles.text,
            isDarkMode ? globalStyles.darkText : globalStyles.lightText,
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
  },
});