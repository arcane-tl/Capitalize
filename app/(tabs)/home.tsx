import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';
import { useUserStore } from '../../constants/userStore';

export default function HomeScreen() {
  const user = useUserStore((state) => state.user);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Welcome, {user?.firstName} {user?.lastName}!</Text>
      <Text style={globalStyles.text}>Email: {user?.email}</Text>
      <Text style={globalStyles.text}>Mobile: {user?.mobile}</Text>
    </View>
  );
}