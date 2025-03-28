import React from 'react';
import { UserProvider } from './components/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Your screens go here */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}