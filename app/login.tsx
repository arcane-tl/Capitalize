import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { auth } from '../components/database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterUser from '../components/RegisterUser';
import { useUserStore } from '../constants/userStore';
import { fetchUserData, addAuditLogEntry } from '../components/firebaseAPI';
import { useThemeStyles } from '@/components/themeUtils';
import { useFonts } from 'expo-font';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState<boolean>(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  // Load fonts using useFonts
  const [fontsLoaded] = useFonts({
    Lobster: require('../assets/fonts/Lobster-Regular.ttf'),
  });

  // Get precomputed styles from the custom hook
  const {
    backgroundColor,
    textStyle,
    inputStyle,
    placeholderTextColor,
  } = useThemeStyles();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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

      const userData = await fetchUserData(uid);
      setUser({ uid, ...userData });

      loginLogEntry.status = 'success';
      await addAuditLogEntry(uid, loginLogEntry);

      router.replace('/(tabs)/home');
    } catch (error: any) {
      loginLogEntry.status = 'failure';
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        await addAuditLogEntry(uid, loginLogEntry);
      }
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.loginContainer, { backgroundColor }]}>
      <Text style={[globalStyles.title, textStyle]}>Capitalize</Text>

      <TextInput
        style={[globalStyles.input, inputStyle, { marginTop: 40 }]}
        placeholder="Email"
        placeholderTextColor={placeholderTextColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={[globalStyles.input, inputStyle]}
        placeholder="Password"
        placeholderTextColor={placeholderTextColor}
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
        style={[globalStyles.registerButton as ViewStyle, { marginTop: 10 }]}
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