import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/css/styles'; // Adjust path

export default function EventsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Events</Text>
      <Text style={globalStyles.text}>Your events content goes here.</Text>
    </View>
  );
}