import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import { getStyle } from '@/components/themeUtils';

export default function EventsScreen() {
  return (
    <View
      style={
        getStyle('Content', globalStyles) as ViewStyle
      }
    >
      <Text
        style={
          getStyle('Text', globalStyles) as TextStyle
        }
      >
        Your events content goes here.
      </Text>
    </View>
  );
}