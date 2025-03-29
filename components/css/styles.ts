import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const globalStyles = StyleSheet.create({
  // View-specific styles
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Default background for light mode
  } as ViewStyle,
  container: {
    flex: 1,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    paddingHorizontal: 20, // Add padding for content
  } as ViewStyle,
  darkContainer: {
    flex: 1,
    backgroundColor: '#000000' as string, // Explicitly cast to string
  } as ViewStyle,
  lightContainer: {
    flex: 1,
    backgroundColor: '#ffffff' as string, // Explicitly cast to string
  } as ViewStyle,
  darkContent: {
    flex: 1,
    backgroundColor: '#000000', // Darker background for content in dark mode
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  lightContent: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Lighter background for content in light mode
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  } as ViewStyle,

  // Input styles
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  } as TextStyle,
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#000',
  } as TextStyle,
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#222',
    color: '#fff',
  } as TextStyle,

  // Button styles
  button: {
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: '#a1c2fa',
    opacity: 0.7,
  } as ViewStyle,
  registerButton: {
    backgroundColor: '#34a853',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  } as TextStyle,

  // Status message styles
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  success: {
    color: '#2ecc71',
  } as TextStyle,
  error: {
    color: '#e74c3c',
  } as TextStyle,

  // Text-specific styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text for readability
  } as TextStyle,
  text: {
    fontSize: 16,
    color: '#666', // Softer color for secondary text
  } as TextStyle,
  darkText: {
    color: '#ffffff', // White text for dark mode
  } as TextStyle,
  lightText: {
    color: '#000000', // Black text for light mode
  } as TextStyle,

  // Tab screen options styles for light mode
  lightTabScreenOptions: {
    headerStyle: {
      backgroundColor: '#fff', // Light mode header background
    },
    headerTintColor: '#000', // Light mode header text color
    tabBarStyle: {
      backgroundColor: '#fff', // Light mode tab bar background
      borderTopColor: '#ccc', // Light mode tab bar border
    },
    tabBarActiveTintColor: '#4285f4',
    tabBarInactiveTintColor: '#666',
  },

  // Tab screen options styles for dark mode
  darkTabScreenOptions: {
    headerStyle: {
      backgroundColor: '#000', // Dark mode header background
    },
    headerTintColor: '#fff', // Dark mode header text color
    tabBarStyle: {
      backgroundColor: '#000', // Dark mode tab bar background
      borderTopColor: '#333', // Dark mode tab bar border
    },
    tabBarActiveTintColor: '#4285f4',
    tabBarInactiveTintColor: '#888',
  },
});