import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { updateData, readData, addData } from '../components/FirebaseApi';

const Events = (props) => {
  //var readTest = readData();
  //console.log('DATA: ', readTest);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const doSomething = () => {
        console.log('Focused Events!');
      };

      doSomething();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>Events Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Events;