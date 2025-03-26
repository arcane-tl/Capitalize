import { Tabs } from 'expo-router';
import { Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/css/styles';

export default function TabsLayout() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4285f4',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: globalStyles.tabBar,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={[globalStyles.tabIcon, { color }]}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Text style={[globalStyles.tabIcon, { color }]}>📊</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="assets"
          options={{
            title: 'Assets',
            tabBarIcon: ({ color }) => (
              <Text style={[globalStyles.tabIcon, { color }]}>💰</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Events',
            tabBarIcon: ({ color }) => (
              <Text style={[globalStyles.tabIcon, { color }]}>📅</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <Text style={[globalStyles.tabIcon, { color }]}>⚙️</Text>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}