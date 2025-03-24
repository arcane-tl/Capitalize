import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';

// Replace these with your Google client IDs from Firebase Console
const GOOGLE_CLIENT_ID_WEB = '23029306910-fuf077kqr0oujhjeqo5acjhfk9v2rm8r.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS = '23029306910-4n4353t32l0qv2bij26acb1nrv20i5rh.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'your-android-client-id-from-firebase';

WebBrowser.maybeCompleteAuthSession(); // Handle redirect after auth

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth();

    // Use makeRedirectUri from expo-auth-session
    const redirectUri = makeRedirectUri({
      scheme: 'capitalize' // Replace with your app's scheme
    });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID_WEB, // Web client ID
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/app'); // Redirect to AppScreen after login
        })
        .catch((error) => {
          console.error('Login failed:', error);
        });
    }
  }, [response, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Capitalize</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: '#4285f4', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16 },
});