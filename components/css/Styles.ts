// Styles.ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const colors = {
  light: {
    background: 'rgba(249, 249, 249, 1)',
    text: 'rgba(0, 0, 0, 1)',
    placeholderText: 'rgba(136, 136, 136, 1)',
    buttonOutline: 'rgba(0, 0, 0, 1)',
    border: 'rgba(204, 204, 204, 1)',
    listItemBackground: 'rgba(255, 255, 255, 1)',
    secondaryText: 'rgba(0, 0, 0, 0.84)',
    deleteBackground: 'rgba(255, 102, 102, 1)',
    modifyBackground: 'rgba(66, 133, 244, 1)',
    deleteText: 'rgba(255, 255, 255, 1)',
    modifyText: 'rgba(255, 255, 255, 1)',
    assetNameTextColor: 'rgba(0, 0, 0, 1)',
    signInButtonBackground: 'rgba(255, 255, 255, 1)', // White for light mode
    registerButtonBackground: 'rgba(66, 133, 244, 1)', // Blue for register button
    registerButtonText: 'rgba(255, 255, 255, 1)',
    successText: 'rgba(46, 204, 113, 1)', // Green for success
    errorText: 'rgba(231, 76, 60, 1)', // Red for error
    iconOutline: 'rgba(0, 0, 0, 1)',
    tabBarActiveTint: 'rgba(66, 133, 244, 1)', // Matches tabBarActiveTintColor
    tabBarInactiveTint: 'rgba(102, 102, 102, 1)', // Matches tabBarInactiveTintColor
    tabBarBackground: 'rgba(255, 255, 255, 1)',
    graphBarBackground: 'rgba(48, 91, 192, 0.85)', // Blue for graph bar background
    graphBarLayout: 'rgba(0, 0, 0, 0.1)', // Light gray for graph bar layout
    graphBarLabel: 'rgba(0, 0, 0, 1)', // Black for graph bar label
    graphBackgroundColor: 'rgba(235, 157, 255, 0.94)', // Lighter background for graph
  },
  dark: {
    background: 'rgba(0, 0, 0, 1)',
    text: 'rgba(255, 255, 255, 1)',
    placeholderText: 'rgba(170, 170, 170, 1)',
    buttonOutline: 'rgba(255, 255, 255, 1)',
    border: 'rgba(85, 85, 85, 1)',
    listItemBackground: 'rgba(26, 26, 26, 1)',
    secondaryText: 'rgba(255, 255, 255, 0.84)',
    deleteBackground: 'rgba(255, 68, 68, 1)',
    modifyBackground: 'rgba(66, 133, 244, 1)',
    deleteText: 'rgba(255, 255, 255, 1)',
    modifyText: 'rgba(255, 255, 255, 1)',
    assetNameTextColor: 'rgba(255, 255, 255, 1)',
    signInButtonBackground: 'rgba(255, 255, 255, 1)', // Darker gray for dark mode
    registerButtonBackground: 'rgba(66, 133, 244, 1)', // Blue for register button
    registerButtonText: 'rgba(255, 255, 255, 1)', // White for register button
    successText: 'rgba(46, 204, 113, 1)', // Green for success
    errorText: 'rgba(231, 76, 60, 1)', // Red for error
    iconOutline: 'rgba(255, 255, 255, 1)',
    tabBarActiveTint: 'rgba(66, 133, 244, 1)', // Matches tabBarActiveTintColor
    tabBarInactiveTint: 'rgba(136, 136, 136, 1)', // Matches tabBarInactiveTintColor
    tabBarBackground: 'rgba(0, 0, 0, 1)',
    graphBarBackground: 'rgba(0, 76, 255, 1)', // Blue for graph bar background
    graphBarLayout: 'rgba(255, 255, 255, 1)', // Light gray for graph bar layout
    graphBackgroundGradientFrom: 'rgb(255, 214, 214)', // Blue for graph bar gradient from
    graphBackgroundGradientTo: 'rgba(255, 57, 57, 0.9)', // Blue for graph bar gradient to
    graphBarLabel: 'rgba(255, 255, 255, 1)', // White for graph bar label
    graphBackgroundColor: 'rgba(135, 219, 255, 0.92)', // Darker background for graph
  },
  // Theme-agnostic colors
  primary: 'rgba(66, 133, 244, 1)',
  secondary: 'rgba(52, 168, 83, 1)',
  modalBackground: 'rgba(55, 55, 55, 0.2)',
  alert: 'rgba(184, 6, 6, 1)',
};

export const globalStyles = {
  // ==============================================================
  // Base Mode Styles, these are common across light and dark modes
  // ==============================================================
  base: StyleSheet.create({
    title: {
      fontFamily: 'Lobster',
      fontSize: 80,
      alignSelf: 'center',
    } as TextStyle,
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
      fontSize: 16,
    } as TextStyle,
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    } as TextStyle,
  }),

  // =========================
  // Light Mode Styles
  // =========================
  light: StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.light.background,
    } as ViewStyle,
    input: {
      borderColor: colors.light.border,
      backgroundColor: colors.light.listItemBackground,
      color: colors.light.text,
    } as TextStyle,
    content: {
      flex: 1,
      backgroundColor: colors.light.background,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    signInButton: {
      backgroundColor: colors.light.signInButtonBackground,
      borderColor: colors.light.buttonOutline,
      borderWidth: 1,
      padding: 10,
      borderRadius: 20,
      marginTop: 40,
      width: '100%',
      alignItems: 'center',
    } as ViewStyle,
    registerButton: {
      backgroundColor: colors.light.registerButtonBackground,
      padding: 10,
      borderRadius: 20,
      width: '100%',
      alignItems: 'center',
    } as ViewStyle,
    registerButtonText: {
      color: colors.light.registerButtonText,
      fontSize: 16,
      fontWeight: 'bold',
    } as TextStyle,
    status: {
      marginTop: 20,
      fontSize: 16,
      textAlign: 'center',
    } as TextStyle,
    headerTitleStyle: {
      fontWeight: 'bold',
      color: colors.light.text as string,
      fontSize: 20,
    } as TextStyle,
    tabScreenStyle: {
      headerStyle: {
        backgroundColor: colors.light.background,
      } as ViewStyle,
      headerTintColor: colors.light.text,
      tabBarStyle: {
        backgroundColor: colors.light.tabBarBackground,
        borderTopColor: colors.light.border,
      } as ViewStyle,
      tabBarActiveTintColor: colors.light.tabBarActiveTint,
      tabBarInactiveTintColor: colors.light.tabBarInactiveTint,
    } as ViewStyle,
    text: {color: colors.light.text,} as TextStyle,
    buttonDisabled: {opacity: 0.6,},
    success: {color: colors.light.successText,} as TextStyle,
    error: {color: colors.light.errorText,} as TextStyle,
  }),

  // =========================
  // Dark Mode Styles
  // =========================
  dark: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark.background,
      justifyContent: 'center',
    } as ViewStyle,
    input: {
      borderColor: colors.dark.border,
      backgroundColor: 'rgba(34, 34, 34, 1)', // Slightly lighter than pure black
      color: colors.dark.text,
    } as TextStyle,
    content: {
      flex: 1,
      backgroundColor: colors.dark.background,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    signInButton: {
      backgroundColor: colors.dark.signInButtonBackground,
      padding: 10,
      borderRadius: 20,
      marginTop: 40,
      width: '100%',
      alignItems: 'center',
    } as ViewStyle,
    registerButton: {
      backgroundColor: colors.dark.registerButtonBackground,
      padding: 10,
      borderRadius: 20,
      width: '100%',
      alignItems: 'center',
    } as ViewStyle,
    registerButtonText: {
      color: colors.dark.registerButtonText,
      fontSize: 16,
      fontWeight: 'bold',
    } as TextStyle,
    status: {
      marginTop: 20,
      fontSize: 16,
      textAlign: 'center',
    } as TextStyle,
    headerTitleStyle: {
      fontWeight: 'bold',
      color: colors.dark.text,
      fontSize: 20,
    } as TextStyle,
    tabScreenStyle: {
      headerStyle: {
        backgroundColor: colors.dark.background,
        height: 110,
        borderBottomWidth: 0,
      },
      tabBarShowLabel: false,
      headerTintColor: colors.dark.text,
      tabBarStyle: {
        backgroundColor: colors.dark.tabBarBackground,
        borderTopColor: colors.dark.border,
        marginTop: 10,
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: colors.dark.tabBarActiveTint,
      tabBarInactiveTintColor: colors.dark.tabBarInactiveTint,
    } as ViewStyle,
    text: {color: colors.dark.text,} as TextStyle,
    buttonDisabled: {opacity: 0.6,} as ViewStyle,
    success: {color: colors.dark.successText,} as TextStyle,
    error: {color: colors.dark.errorText,} as TextStyle,
  }),
};