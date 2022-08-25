import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Google from 'expo-google-app-auth'
import { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const styles = {
  googleLoginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    width: Dimensions.get('window').width,
    height: 70,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    textAlignment: 'center',
    fontSize: 60,
    marginTop: 280,
    marginBottom: 50,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  }
};

const auth = getAuth();

class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    console.log("CHECKING IF USER IS FOUND IN FIREBASE.");
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      console.log(firebaseUser.providerData)
      console.log(googleUser.user.id)
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.user.id) {
          // We don't need to reauth the Firebase connection.
          console.log("USER FOUND IN FIREBASE!");
          return true;
        }
      }
    }
    console.log("USER NOT FOUND IN FIREBASE!");
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('AUTHENTICATING WITH GOOGLE USER: ', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        console.log('UNABLE TO FIND GOOGLEUSER FROM FIREBASE USERS: ', googleUser.email);
        // Build Firebase credential with the Google ID token.
        const credential = GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        signInWithCredential(auth, credential)
          .then(function(result) {
            console.log('USER AUTHENTICATED TO FIREBASE IN WITH GOOGLE CREDENTIALS: ', result.user.email);
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
        //behavior: 'web',
        iosClientId: '23029306910-4n4353t32l0qv2bij26acb1nrv20i5rh.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        console.log('GOOGLE SIGN-IN SUCCESS: ', result.user.email);
        this.onSignIn(result);
        return result.accessToken;
      } else {
        console.log('GOOGLE SIGN-IN FAILURE!');
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title} >Capitalize!</Text>
        <TouchableOpacity
          onPress={() => this.signInWithGoogleAsync()}
          style={styles.container}
          activeOpacity={0.5} >
          <Image source={require('../images/google_signin_btn.png')}
            style={styles.googleLoginBtn}
          />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default LoginScreen;