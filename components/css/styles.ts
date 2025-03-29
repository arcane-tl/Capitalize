import { StyleSheet } from 'react-native';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Default background for light mode
  },
  container: {
    flex: 1,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    paddingHorizontal: 20, // Add padding for content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text for readability
  },
  text: {
    fontSize: 16,
    color: '#666', // Softer color for secondary text
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabIcon: {
    fontSize: 20, // For emoji or text-based icons
  },

  // Dark mode styles
  darkContainer: {
    backgroundColor: '#000000', // Dark background for dark mode
  },
  lightContainer: {
    backgroundColor: '#ffffff', // Light background for light mode
  },
  darkText: {
    color: '#ffffff', // White text for dark mode
  },
  lightText: {
    color: '#000000', // Black text for light mode
  },

  // Content-specific styles
  darkContent: {
    flex: 1,
    backgroundColor: '#000000', // Darker background for content in dark mode
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContent: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Lighter background for content in light mode
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input styles
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#222',
    color: '#fff',
  },

  // Button styles
  button: {
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a1c2fa',
    opacity: 0.7,
  },
  registerButton: {
    backgroundColor: '#34a853',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  // Status message styles
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  success: {
    color: '#2ecc71',
  },
  error: {
    color: '#e74c3c',
  },
  
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