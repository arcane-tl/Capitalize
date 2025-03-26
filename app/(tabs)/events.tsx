import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function EventsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Events</Text>
      <Text style={globalStyles.text}>Your events content goes here.</Text>
    </View>
  );
}