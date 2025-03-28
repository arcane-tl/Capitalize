import { Tabs } from 'expo-router';
import { TouchableOpacity, StatusBar, Text, View } from 'react-native';
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
            headerRight: () => {
              const router = useRouter();
              const handleLogout = () => {
                router.replace('/');
              };
              return (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Text style={{ fontSize: 24, color: '#4285f4' }}>{'⏏️'}</Text>
                </TouchableOpacity>
              );
            },
            tabBarActiveTintColor: '#4285f4',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: globalStyles.tabBar,
          }}
        >
          <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => 
            <Text style={{ color }}>{'🏠'}</Text> }} />
          <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color }) =>
            <Text style={{ color }}>{'📊'}</Text> }} />
          <Tabs.Screen name="assets" options={{ title: 'Assets', tabBarIcon: ({ color }) =>
            <Text style={{ color }}>{'💰'}</Text> }} />
          <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ color }) =>
            <Text style={{ color }}>{'📅'}</Text> }} />
          <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) =>
            <Text style={{ color }}>{'⚙️'}</Text> }} />
        </Tabs>
      </View>
    </>
  );
}