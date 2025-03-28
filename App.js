import React from 'react';
import { UserProvider } from './components/UserContext'; // Ensure this path is correct
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Wrap the entire app with UserProvider
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Your screens go here */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}