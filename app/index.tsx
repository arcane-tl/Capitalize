import React, { useState } from 'react';
import { Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import RegisterUser from '../components/RegisterUser';
import { useUserStore } from '../constants/userStore';
import { useUserPreferences } from '../constants/userPreferences'; // Import theme store
import { fetchUserData } from '../components/firebaseAPI';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState<boolean>(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  // Access the theme preference
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Signing in...');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user data using fetchUserData
      const userData = await fetchUserData(uid);

      // Update Zustand store with user data
      setUser({ uid, ...userData });

      setStatusMessage('Login successful! Redirecting...');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text
        style={[
          globalStyles.title,
          isDarkMode ? globalStyles.darkText : globalStyles.lightText,
        ]}
      >
        Login to Capitalize
      </Text>

      <TextInput
        style={[
          globalStyles.input,
          isDarkMode ? globalStyles.darkInput : globalStyles.lightInput,
        ]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={[
          globalStyles.input,
          isDarkMode ? globalStyles.darkInput : globalStyles.lightInput,
        ]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[globalStyles.button, isLoading && globalStyles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={globalStyles.buttonText}>
          {isLoading ? 'Processing...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.registerButton, { marginTop: 10 }]}
        onPress={() => setRegisterModalVisible(true)}
      >
        <Text style={globalStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      {statusMessage ? (
        <Text
          style={[
            globalStyles.status,
            statusMessage.includes('successful') ? globalStyles.success : globalStyles.error,
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}

      <RegisterUser
        visible={isRegisterModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        initialEmail={email} // Pass email from LoginScreen
        initialPassword={password} // Pass password from LoginScreen
      />
    </SafeAreaView>
  );
}