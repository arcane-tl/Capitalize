import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Google from 'expo-google-app-auth'
import { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();

class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      //console.log(firebaseUser.providerData)
      //console.log(googleUser.user.id)
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.user.id) {
          // We don't need to reauth the Firebase connection.
          console.log('Käyttäjä löytyi firebasesta!')
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        console.log('Creating Firebase user');
        // Build Firebase credential with the Google ID token.
        const credential = GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        signInWithCredential(auth, credential)
          .then(function(result) {
            console.log('User signed-in after firebaseUser creation. Adding user to database.');

          }) .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The credential that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        //androidClientId: YOUR_CLIENT_ID_HERE,
        behavior: 'web',
        iosClientId: '23029306910-4n4353t32l0qv2bij26acb1nrv20i5rh.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        console.log('Jee sisällä ollaan!')
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Button
          title="GOOGLE"
          onPress={() => this.signInWithGoogleAsync()}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;