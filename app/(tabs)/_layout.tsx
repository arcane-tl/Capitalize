import { Tabs } from 'expo-router';
import { TouchableOpacity, StatusBar, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { globalStyles } from '../../components/css/styles';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }} edges={['top']}>
        <Tabs
          screenOptions={{
            headerShown: true, // Show headers
            headerLeft: () => {
              const router = useRouter();
              const handleProfile = () => {
                router.push('/profile'); // Navigate to the profile page
              };
              return (
                <TouchableOpacity onPress={handleProfile} style={{ marginLeft: 15 }}>
                  <Ionicons name="person-outline" size={24} color="#4285f4" />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              const router = useRouter();
              const handleLogout = () => {
                router.replace('/');
              };
              return (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="#4285f4" />
                </TouchableOpacity>
              );
            },
            tabBarActiveTintColor: '#4285f4',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: globalStyles.tabBar,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="assets"
            options={{
              title: 'Assets',
              tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="events"
            options={{
              title: 'Events',
              tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </>
  );
}