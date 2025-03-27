import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setStatusMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Signing in...');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatusMessage('Login successful! Redirecting...');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Would you like to register instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Register', onPress: handleRegister },
          ]
        );
      } else {
        setStatusMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setStatusMessage('Registering...');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStatusMessage('Registration successful! Redirecting...');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setStatusMessage(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={globalStyles.title}>Login to Capitalize</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {statusMessage ? (
        <Text
          style={[
            styles.status,
            statusMessage.includes('successful') ? styles.success : styles.error,
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a1c2fa',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  success: {
    color: '#2ecc71',
  },
  error: {
    color: '#e74c3c',
  },
});