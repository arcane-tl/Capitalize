import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/css/styles'; // Adjust path

export default function DashboardScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={globalStyles.text}>Your dashboard content goes here.</Text>
    </View>
  );
}