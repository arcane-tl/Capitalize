import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import ScreenWithLogout from '../../components/ScreenWithLogout';

export default function EventsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Your events content goes here.</Text>
    </View>
  );
}