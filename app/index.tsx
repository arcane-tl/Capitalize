import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles, colors } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterUser from '../components/RegisterUser';
import { useUserStore } from '../constants/userStore';
import { useUserPreferences } from '../constants/userPreferences';
import { fetchUserData } from '../components/firebaseAPI';
import { addAuditLogEntry } from '../components/firebaseAPI';
import { getStyle } from '@/components/themeUtils';
import * as Font from 'expo-font';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState<boolean>(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Lobster: require('../assets/fonts/Lobster-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  // Access the theme preference
  const { theme } = useUserPreferences();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }
  
    setIsLoading(true);
  
    const loginLogEntry = {
      name: 'Login',
      time: Date.now(),
      status: '',
    };
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Fetch user data using fetchUserData
      const userData = await fetchUserData(uid);
  
      // Update Zustand store with user data
      setUser({ uid, ...userData });
  
      // Log the sign-in event in the audit log
      loginLogEntry.status = 'success';
      await addAuditLogEntry(uid, loginLogEntry);
  
      router.replace('/(tabs)/home');
    } catch (error: any) {
      // Log the failed sign-in attempt in the audit log
      loginLogEntry.status = 'failure';
  
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        await addAuditLogEntry(uid, loginLogEntry);
      }
  
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false); // Ensure loading state is reset in all cases
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.loginContainer as ViewStyle,
        getStyle('Container', globalStyles) as ViewStyle,
      ]}
    >

      <Text
        style={[
          globalStyles.title as TextStyle,
          getStyle('Text', globalStyles) as TextStyle,
        ]}
      >
        Capitalize
      </Text>

      <TextInput
        style={[
          globalStyles.input as TextStyle,
          getStyle('Input', globalStyles) as TextStyle,
          { marginTop: 40 },
        ]}
        placeholder="Email"
        placeholderTextColor={ getStyle('PlaceholderText', colors) }
        value={ email }
        onChangeText={ setEmail }
        keyboardType="email-address"
        autoCapitalize="none"
        editable={ !isLoading }
      />
      <TextInput
        style={[
          globalStyles.input as TextStyle,
          getStyle('Input', globalStyles) as TextStyle,
        ]}
        placeholder="Password"
        placeholderTextColor={ getStyle('PlaceholderText', colors) }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[
          globalStyles.signInButton as ViewStyle,
          isLoading && (globalStyles.buttonDisabled as ViewStyle),
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={globalStyles.buttonText as TextStyle}>
          {isLoading ? 'Processing...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.registerButton as ViewStyle,
          { marginTop: 10 },
        ]}
        onPress={() => setRegisterModalVisible(true)}
      >
        <Text style={globalStyles.registerButtonText as TextStyle}>
          Create account
        </Text>
      </TouchableOpacity>

      {statusMessage ? (
        <Text
          style={[
            globalStyles.status as TextStyle,
            statusMessage.includes('successful')
              ? (globalStyles.success as TextStyle)
              : (globalStyles.error as TextStyle),
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}

      <RegisterUser
        visible={isRegisterModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        initialEmail={email}
        initialPassword={password}
      />
    </SafeAreaView>
  );
}