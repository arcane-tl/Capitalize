import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { initializeApp, getApps } from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { firebaseConfig } from '../src/database/firebaseConfig';

// Initialize Firebase only if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function LoadingScreen() {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, go to AppScreen
        router.replace('/app');
      } else {
        // No user, go to LoginScreen
        router.replace('/login');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}