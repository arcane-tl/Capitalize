import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const styles = StyleSheet.create({
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
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderRadius: 40,
    marginBottom: 10,
  }
});

export default function LoginScreen() {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  //Google authentication
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '23029306910-4n4353t32l0qv2bij26acb1nrv20i5rh.apps.googleusercontent.com',
    expoClientId: '23029306910-v0mm2vf45b8ll19tc6g89fbb6i0iftgb.apps.googleusercontent.com',
    webClientId: '23029306910-fuf077kqr0oujhjeqo5acjhfk9v2rm8r.apps.googleusercontent.com',
    redirectUri,
    scopes: ['profile', 'email'],
    },
    discovery
  );

  //Firebase authentication
  const auth = getAuth();

  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (request) {
      console.log('Request redirectUri:', request.redirectUri);
    }
    if (response?.type === "success") {
      console.log('GOOGLE SIGN-IN SUCCESS!');
      setAccessToken(response.authentication.accessToken);
      onSignIn(response);
    } else if (response?.type === 'error') {
      console.log('GOOGLE SIGN-IN ERROR:', response.error, response.errorDescription);
    } else {
      console.log('GOOGLE SIGN-IN FAILURE!');
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });
  }

  isUserEqual = (googleUser, firebaseUser) =>{
    console.log('CHECKING IF FIREBASE USER AND GOOGLE USER MATCH!');
    console.log('googleUser: ', googleUser);
    console.log('firebaseUser: ', firebaseUser);
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.user.id) {
          console.log('MATCH!');
          return true;
        }
      }
    }
    console.log('NOT A MATCH');
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('AUTHENTICATING WITH GOOGLE USER: ', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
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

  showUserInfo = () => {
    if (userInfo) {
      return (
        <View style={styles.container}>
          <Image source={{uri: userInfo.picture}}
            style={styles.image} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} >Capitalize!</Text>
      <TouchableOpacity
        onPress = {
          accessToken ? getUserData : () => {
            promptAsync({showInRecents: true})
          }
        }
        style={styles.container}
        activeOpacity={0.5} >
        <Image source={require('../images/google_signin_btn.png')}
          style={styles.googleLoginBtn}
        />
      </TouchableOpacity>
      {showUserInfo()}
      <StatusBar style="auto" />
    </View>
  );
}