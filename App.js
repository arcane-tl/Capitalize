import 'react-native-gesture-handler';
import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

//Import Screens
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import NavigationBar from './src/components/NavigationBar';
//import Test from './src/screens/TestScreen';

export default function App(props) {
  return (
    <AppNavigator />
  );
};

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  LoginScreen:LoginScreen,
  AppScreen:NavigationBar
  //Test:Test
})

const AppNavigator = createAppContainer(AppSwitchNavigator);