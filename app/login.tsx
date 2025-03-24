import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Replace these with your Google client IDs from Firebase Console
const GOOGLE_CLIENT_ID_WEB = 'your-web-client-id-from-firebase';
const GOOGLE_CLIENT_ID_IOS = 'your-ios-client-id-from-firebase';
const GOOGLE_CLIENT_ID_ANDROID = 'your-android-client-id-from-firebase';

WebBrowser.maybeCompleteAuthSession(); // Handle redirect after auth

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID_WEB, // Web client ID
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
  });

  useEffect(() => {
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