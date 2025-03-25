import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Replace these with your Google client IDs from Firebase Console
const CLIENT_ID = '23029306910-fuf077kqr0oujhjeqo5acjhfk9v2rm8r.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession(); // Handle redirect after auth

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth();
  const redirectUri = 'https://auth.digileap.fi/__/auth/handler';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri,
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

  // Log the auth URL before sending
  const handleGoogleSignIn = () => {
    if (request) {
      // The request.url contains the full OAuth authorization URL
      console.log('Auth Request URL:', request.url);
      promptAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Capitalize</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignIn}
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