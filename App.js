import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

//Import Screens
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import NavigationBar from './src/components/NavigationBar';

export default function App(props) {
  return (
    <AppNavigator />
  );
};

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  LoginScreen:LoginScreen,
  AppScreen:NavigationBar
})

const AppNavigator = createAppContainer(AppSwitchNavigator);