import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ViewStyle,
  TextStyle,
  StatusBar,
} from 'react-native'; // Added ViewStyle and TextStyle
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        globalStyles.container as ViewStyle, // Explicitly cast to ViewStyle
        isDarkMode
          ? (globalStyles.darkContainer as ViewStyle) // Explicitly cast to ViewStyle
          : (globalStyles.lightContainer as ViewStyle), // Explicitly cast to ViewStyle
      ]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text
        style={[
          globalStyles.title as TextStyle, // Explicitly cast to TextStyle
          isDarkMode
            ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
            : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
        ]}
      >
        Login to Capitalize
      </Text>

      <TextInput
        style={[
          globalStyles.input as TextStyle, // Explicitly cast to ViewStyle
          isDarkMode
            ? (globalStyles.darkInput as TextStyle) // Explicitly cast to ViewStyle
            : (globalStyles.lightInput as TextStyle), // Explicitly cast to ViewStyle
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
          globalStyles.input as TextStyle, // Explicitly cast to ViewStyle
          isDarkMode
            ? (globalStyles.darkInput as TextStyle) // Explicitly cast to ViewStyle
            : (globalStyles.lightInput as TextStyle), // Explicitly cast to ViewStyle
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
        style={[
          globalStyles.button as ViewStyle, // Explicitly cast to ViewStyle
          isLoading && (globalStyles.buttonDisabled as ViewStyle), // Explicitly cast to ViewStyle
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={globalStyles.buttonText as TextStyle}> {/* Explicitly cast to TextStyle */}
          {isLoading ? 'Processing...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.registerButton as ViewStyle, // Explicitly cast to ViewStyle
          { marginTop: 10 },
        ]}
        onPress={() => setRegisterModalVisible(true)}
      >
        <Text style={globalStyles.buttonText as TextStyle}> {/* Explicitly cast to TextStyle */}
          Register
        </Text>
      </TouchableOpacity>

      {statusMessage ? (
        <Text
          style={[
            globalStyles.status as TextStyle, // Explicitly cast to TextStyle
            statusMessage.includes('successful')
              ? (globalStyles.success as TextStyle) // Explicitly cast to TextStyle
              : (globalStyles.error as TextStyle), // Explicitly cast to TextStyle
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