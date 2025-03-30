import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import { getStyle } from '@/components/themeUtils';
import { get } from 'firebase/database';

export default function AssetsScreen() {
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
        Your assets content goes here.
      </Text>
    </View>
  );
}