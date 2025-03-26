import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/css/styles'; // Adjust path

export default function AssetsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Assets</Text>
      <Text style={globalStyles.text}>Your assets content goes here.</Text>
    </View>
  );
}