import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function AssetsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Your assets content goes here.</Text>
    </View>
  );
}