import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './database/FirebaseConfig';
import { useRouter } from 'expo-router';
import { addUser } from './FirebaseAPI';

interface RegisterUserProps {
  visible: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialPassword?: string;
}

export default function RegisterUser({
  visible,
  onClose,
  initialEmail = '',
  initialPassword = '',
}: RegisterUserProps) {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>(initialPassword);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setEmail(initialEmail);
    setPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  const handleRegister = async () => {
    if (!firstName || !lastName || !mobile || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        firstName,
        lastName,
        mobile,
        email,
      };
      await addUser(uid, userData);

      Alert.alert('Success', 'Registration successful! Please sign in to continue.');
      onClose();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Phone"
            placeholderTextColor="#888"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#34a853',
    padding: 10,
    borderRadius: 5,
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
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});