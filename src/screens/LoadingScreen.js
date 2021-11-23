import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { firebaseConfig } from '../database/firebaseConfig';
import { initializeApp, getApp, getApps } from 'firebase/app';
initializeApp(firebaseConfig)

import { onAuthStateChanged, getAuth } from 'firebase/auth'

const auth = getAuth();

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    console.log('Checking if User is logged in')
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user logged in: moving to navigation menu')
        this.props.navigation.navigate('AppScreen');
      } else {
        console.log('user not logged in: moving to login screen')
        this.props.navigation.navigate('LoginScreen');
      }
    });
  };

  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});