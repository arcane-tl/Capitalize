import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStyles } from '@/components/ThemeUtils';

export default function EventsScreen() {
  const themeStyles = useThemeStyles();

  return (
    <View style={themeStyles.contentStyle}>
      <Text style={themeStyles.textStyle}>
        The events list comes here.
      </Text>
    </View>
  );
}