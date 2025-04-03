import { useUserPreferences } from '../constants/userPreferences';
import { TextStyle, ViewStyle } from 'react-native';
import { globalStyles, colors } from '../components/css/styles';

/**
 * Helper function to dynamically select a style or color based on the theme.
 * @param styleName - The base name of the style or color (e.g., "Container", "Text", "PlaceholderText").
 * @param source - The source object containing the styles or colors (e.g., globalStyles or colors).
 * @returns The appropriate style (ViewStyle/TextStyle) or color (string) based on the theme.
 */
export const getStyle = <T extends ViewStyle | TextStyle | string>(
  styleName: string,
  source: Record<string, T>
): T => {
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';
  const prefix = isDarkMode ? 'dark' : 'light';
  const fullStyleName = `${prefix}${styleName}`;

  if (!source[fullStyleName]) {
    throw new Error(`Style or color "${fullStyleName}" not found in source.`);
  }

  return source[fullStyleName];
};

export const useThemeStyles = () => {
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  return {
    backgroundColor: isDarkMode ? colors.darkBackground : colors.lightBackground,
    textStyle: isDarkMode ? globalStyles.darkText : globalStyles.lightText,
    inputStyle: isDarkMode ? globalStyles.darkInput : globalStyles.lightInput,
    placeholderTextColor: isDarkMode ? colors.darkPlaceholderText : colors.lightPlaceholderText,
    buttonOutlineColor: isDarkMode ? colors.darkButtonOutline : colors.lightButtonOutline,
    contentViewStyle: isDarkMode ? globalStyles.darkContent : globalStyles.lightContent,
    listItemBackground: isDarkMode ? colors.darkListItemBackground : colors.lightListItemBackground,
    secondaryTextColor: isDarkMode ? colors.darkSecondaryText : colors.lightSecondaryText,
    deleteBackgroundColor: isDarkMode ? colors.darkDeleteBackground : colors.lightDeleteBackground,
    deleteTextColor: isDarkMode ? colors.darkDeleteText : colors.lightDeleteText,
    borderColor: isDarkMode ? colors.darkBorder : colors.lightBorder,
    assetNameTextColor: isDarkMode ? colors.darkAssetNameTextColor : colors.lightAssetNameTextColor,
  };
};