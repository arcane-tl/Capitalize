import { Tabs } from 'expo-router';
import { StatusBar, Text, View } from 'react-native';
import { globalStyles } from '../../components/css/styles';

export default function TabsLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }} edges={['top']}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#4285f4',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: globalStyles.tabBar, // Remove absolute positioning
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