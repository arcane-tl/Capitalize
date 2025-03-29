import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StatusBar, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../components/css/styles';
import { useUserPreferences } from '../../constants/userPreferences';

export default function TabsLayout() {
  const { theme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={[
          isDarkMode
            ? (globalStyles.darkContainer as ViewStyle)
            : (globalStyles.lightContainer as ViewStyle),
          { flex: 1 },
        ]}
      >
        <Tabs
          screenOptions={{
            ...(isDarkMode
              ? globalStyles.darkTabScreenOptions
              : globalStyles.lightTabScreenOptions),
            tabBarShowLabel: false,
            tabBarStyle: {
              marginTop: 10, // Add margin to the top
              height: 85, // Adjust height for better spacing
              justifyContent: 'center', // Center icons vertically
              alignItems: 'center', // Center icons horizontally
              backgroundColor: isDarkMode
                ? globalStyles.darkContainer.backgroundColor
                : globalStyles.lightContainer.backgroundColor,
              borderTopWidth: 0, // Remove border for a cleaner look
            },
            headerStyle: {
              height: 110, // Increase the height of the header area
              backgroundColor: isDarkMode
                ? globalStyles.darkContainer.backgroundColor
                : globalStyles.lightContainer.backgroundColor,
              borderBottomWidth: 0, // Remove border for a cleaner look
            },
            headerLeft: () => {
              const router = useRouter();
              const handleProfile = () => {
                router.push('/profile'); // Navigate to the profile page
              };
              return (
                <TouchableOpacity onPress={handleProfile} style={{ marginLeft: 15 }}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={isDarkMode ? '#fff' : '#88888'}
                  />
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
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={isDarkMode ? '#fff' : '#88888'}
                  />
                </TouchableOpacity>
              );
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={focused ? (isDarkMode ? '#4285f4' : '#4285f4') : (isDarkMode ? '#fff' : '#88888')}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="stats-chart-outline"
                  size={24}
                  color={focused ? (isDarkMode ? '#4285f4' : '#4285f4') : (isDarkMode ? '#fff' : '#88888')}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="assets"
            options={{
              title: 'Assets',
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="wallet-outline"
                  size={24}
                  color={focused ? (isDarkMode ? '#4285f4' : '#4285f4') : (isDarkMode ? '#fff' : '#88888')}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="events"
            options={{
              title: 'Events',
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={focused ? (isDarkMode ? '#4285f4' : '#4285f4') : (isDarkMode ? '#fff' : '#88888')}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </>
  );
}