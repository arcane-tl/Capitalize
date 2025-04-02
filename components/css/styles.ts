import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Define a centralized color palette
export const colors = {
  // Existing colors
  lightBackground: 'rgba(255, 255, 255, 1)',
  darkBackground: 'rgba(0, 0, 0, 1)',
  lightText: 'rgba(0, 0, 0, 1)',
  darkText: 'rgba(255, 255, 255, 1)',
  primary: 'rgba(66, 133, 244, 1)',
  secondary: 'rgba(52, 168, 83, 1)',
  lightBorderColor: 'rgba(204, 204, 204, 1)',
  darkBorderColor: 'rgba(85, 85, 85, 1)',
  lightIconOutline: 'rgba(0, 0, 0, 1)',
  darkIconOutline: 'rgba(255, 255, 255, 1)',
  lightPlaceholderText: 'rgba(136, 136, 136, 1)',
  darkPlaceholderText: 'rgba(170, 170, 170, 1)',
  modalBackground: 'rgba(55, 55, 55, 0.2)',
  alert: 'rgba(184, 6, 6, 1)',
  darkButtonBackground: 'rgba(66, 133, 244, 1)',
  lightButtonBackground: 'rgba(66, 133, 244, 1)',
  darkButtonOutline: 'rgba(255, 255, 255, 1)',
  lightButtonOutline: 'rgba(0, 0, 0, 1)',

  // New colors for AssetsScreen
  darkListItemBackground: 'rgba(26, 26, 26, 1)',     // Dark gray for dark mode list items
  lightListItemBackground: 'rgba(245, 245, 245, 1)', // Light gray for light mode list items
  darkSecondaryText: 'rgba(255, 255, 255, 0.84)',    // Dimmed white for dark mode secondary text
  lightSecondaryText: 'rgba(0, 0, 0, 0.84)',         // Dimmed black for light mode secondary text
  darkDeleteBackground: 'rgba(255, 68, 68, 1)',      // Red for dark mode delete background
  lightDeleteBackground: 'rgba(255, 102, 102, 1)',   // Lighter red for light mode delete background
  darkDeleteText: 'rgba(255, 255, 255, 1)',          // White for dark mode delete text
  lightDeleteText: 'rgba(255, 255, 255, 1)',         // White for light mode delete text
  darkBorder: 'rgba(255, 255, 255, 0.2)',            // Subtle border for dark mode
  lightBorder: 'rgba(0, 0, 0, 0.2)',                 // Subtle border for light mode
  darkAssetNameTextColor: 'rgba(255, 255, 255, 1)',  // White for dark mode asset name text
  lightAssetNameTextColor: 'rgba(0, 0, 0, 1)',       // Black for light mode asset name text
};

// Custom bar styles (unchanged)
export const customBarStyles = {
  lightStatusBar: 'dark-content',
  darkStatusBar: 'light-content',
};

// Define global styles (unchanged)
export const globalStyles = StyleSheet.create({
  // View-specific styles
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as ViewStyle,
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
  } as ViewStyle,
  darkContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  } as ViewStyle,
  lightContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as ViewStyle,
  darkContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  lightContent: {
    flex: 1,
    backgroundColor: 'rgba(249, 249, 249, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(204, 204, 204, 1)',
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
    borderColor: 'rgba(204, 204, 204, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: 'rgba(0, 0, 0, 1)',
  } as TextStyle,
  darkInput: {
    borderColor: 'rgba(85, 85, 85, 1)',
    backgroundColor: 'rgba(34, 34, 34, 1)',
    color: 'rgba(255, 255, 255, 1)',
  } as TextStyle,

  // Button styles
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: 'rgba(161, 194, 250, 1)',
    opacity: 0.7,
  } as ViewStyle,
  registerButton: {
    backgroundColor: 'rgba(66, 133, 244, 1)',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
  } as TextStyle,
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  } as TextStyle,

  // Status message styles
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  success: {
    color: 'rgba(46, 204, 113, 1)',
  } as TextStyle,
  error: {
    color: 'rgba(231, 76, 60, 1)',
  } as TextStyle,

  // Text-specific styles
  title: {
    fontSize: 75,
    fontWeight: 'bold',
    fontFamily: 'Lobster',
    marginBottom: 20,
    color: 'rgba(51, 51, 51, 1)',
  } as TextStyle,
  text: {
    fontSize: 16,
    color: 'rgba(102, 102, 102, 1)',
  } as TextStyle,
  darkText: {
    color: 'rgba(255, 255, 255, 1)',
  } as TextStyle,
  lightText: {
    color: 'rgba(0, 0, 0, 1)',
  } as TextStyle,
  darkAssetNameStyle: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  lightAssetNameStyle: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
});