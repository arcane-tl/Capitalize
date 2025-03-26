import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function SettingsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={globalStyles.text}>Your settings content goes here.</Text>
    </View>
  );
}