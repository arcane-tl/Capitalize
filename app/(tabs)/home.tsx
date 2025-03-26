import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/css/styles'; // Adjust path

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to the Home Screen!</Text>
      <Text style={globalStyles.text}>You are successfully logged in.</Text>
    </View>
  );
}