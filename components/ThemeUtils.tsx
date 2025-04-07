// ThemeUtils.ts
import { ViewStyle, TextStyle } from 'react-native';
import { useUserPreferences } from '../constants/userPreferences';
import { colors, globalStyles } from './css/Styles';

interface TabScreenStyleConfig {
  headerStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  headerTintColor?: string;
  tabBarActiveTintColor?: string;
  tabBarInactiveTintColor?: string;
  tabBarShowLabel?: boolean;
}

export const useThemeStyles = () => {
  const { theme } = useUserPreferences();
  const themeColors = colors[theme];
  const themeStyles = globalStyles[theme];

  // Dynamically determine the statusBarStyle based on the theme
  const statusBarStyle: 'light-content' | 'dark-content' =
    theme === 'dark' ? 'light-content' : 'dark-content';

  return {
    containerStyle: themeStyles.container as ViewStyle,
    contentStyle: themeStyles.content as ViewStyle,
    textStyle: themeStyles.text as TextStyle,
    inputStyle: { ...globalStyles.base.input, ...themeStyles.input },
    buttonTextStyle: globalStyles.base.buttonText,
    placeholderTextColor: themeColors.placeholderText,
    buttonOutlineColor: themeColors.buttonOutline,
    listItemBackgroundColor: themeColors.listItemBackground,
    secondaryTextColor: themeColors.secondaryText,
    deleteBackgroundColor: themeColors.deleteBackground,
    modifyBackgroundColor: themeColors.modifyBackground,
    deleteTextColor: themeColors.deleteText,
    modifyTextColor: themeColors.modifyText,
    borderColor: themeColors.border,
    assetNameTextColor: themeColors.assetNameTextColor,
    backgroundColor: themeColors.background,
    statusBarStyle, 
    signInButtonStyle: themeStyles.signInButton,
    buttonDisabledStyle: themeStyles.buttonDisabled,
    registerButtonStyle: themeStyles.registerButton,
    registerButtonTextStyle: themeStyles.registerButtonText,
    statusStyle: themeStyles.status,
    successStyle: themeStyles.success,
    errorStyle: themeStyles.error,
    iconOutlineColor: themeColors.iconOutline,
    TabScreenStyle: themeStyles.tabScreenStyle as TabScreenStyleConfig,
    graphBarBackgroundColor: themeColors.graphBarBackground,
    graphBarLayoutColor: themeColors.graphBarLayout,
    graphBarLabelColor: themeColors.graphBarLabel,
    graphBackgroundGradientFromColor: themeColors.graphBackgroundGradientFrom,
    graphBackgroundGradientToColor: themeColors.graphBackgroundGradientTo,
    graphBackgroundColor: themeColors.graphBackgroundColor,
  }
};