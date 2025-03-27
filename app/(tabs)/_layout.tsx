import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4285f4',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: [globalStyles.tabBar, { position: 'absolute', bottom: 0, left: 0, right: 0 }],
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: true,
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
    </View>
  );
}