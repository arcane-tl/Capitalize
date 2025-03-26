import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function DashboardScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={globalStyles.text}>Your dashboard content goes here.</Text>
    </View>
  );
}