import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import { auth } from '@/components/database/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterUser from '@/components/RegisterUser';
import { useUserStore } from '@/constants/userStore';
import { fetchUserData, addAuditLogEntry } from '@/components/FirebaseAPI';
import { useThemeStyles } from '@/components/ThemeUtils';
import { useFonts } from 'expo-font';
import { globalStyles } from '@/components/css/Styles';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState<boolean>(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Lobster: require('../assets/fonts/Lobster-Regular.ttf'),
  });

  // Get styles from useThemeStyles
  const {
    containerStyle,
    textStyle,
    inputStyle,
    placeholderTextColor,
    buttonTextStyle,
    signInButtonStyle,
    buttonDisabledStyle,
    registerButtonStyle,
    registerButtonTextStyle,
    statusStyle,
    successStyle,
    errorStyle,
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

      router.replace('/(tabs)/HomeScreen');
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
    <SafeAreaView style={containerStyle}>
      <Text style={[globalStyles.base.title, textStyle]}>Capitalize</Text>
      <View style={{ width: '87%', alignSelf: 'center' }}>
        <TextInput
          style={[inputStyle, { marginTop: 40 }]}
          placeholder="Email"
          placeholderTextColor={placeholderTextColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={inputStyle}
          placeholder="Password"
          placeholderTextColor={placeholderTextColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[signInButtonStyle, isLoading && buttonDisabledStyle]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={buttonTextStyle}>
            {isLoading ? 'Processing...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[registerButtonStyle, { marginTop: 20, }]}
          onPress={() => setRegisterModalVisible(true)}
        >
          <Text style={registerButtonTextStyle}>Create an account</Text>
        </TouchableOpacity>
      </View>

      {statusMessage ? (
        <Text
          style={[
            statusStyle,
            statusMessage.includes('successful') ? successStyle : errorStyle,
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