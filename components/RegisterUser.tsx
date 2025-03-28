import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { checkUserExists } from '../components/firebaseAPI';
import RegisterUser from '../components/RegisterUser';
import { useUser } from '../components/UserContext';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState<boolean>(false);

  const router = useRouter();
  const { setUser } = useUser(); // Destructure setUser from useUser

  const handleLogin = async () => {
    if (!email || !password) {
      setStatusMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Signing in...');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      const userExists = await checkUserExists(user.uid);
      if (userExists) {
        const userData = {
          firstName: 'John',
          lastName: 'Doe',
          email: user.email || '',
        };
        setUser(userData);

        setStatusMessage('Login successful! Redirecting...');
        router.replace('/(tabs)/home');
      } else {
        setStatusMessage('User data not found in the database. Please contact support.');
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/user-not-found') {
        setStatusMessage('User not found. Please register.');
      } else if (error.code === 'auth/wrong-password') {
        setStatusMessage('Incorrect password. Please try again.');
      } else {
        setStatusMessage(`Unexpected error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={globalStyles.title}>Login to Capitalize</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
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

      <TouchableOpacity
        style={[styles.registerButton, isLoading && styles.buttonDisabled]}
        onPress={() => setIsRegisterVisible(true)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <RegisterUser
        isVisible={isRegisterVisible}
        onClose={() => setIsRegisterVisible(false)}
        setStatusMessage={setStatusMessage}
        initialEmail={email}
        initialPassword={password}
      />

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
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
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
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
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