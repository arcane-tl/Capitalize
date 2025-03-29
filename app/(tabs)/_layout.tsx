import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StatusBar, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, darkTabScreenOptions, lightTabScreenOptions } from '../../components/css/styles';
import { useUserPreferences } from '../../constants/userPreferences';

// Helper function to determine icon properties
const getIconProps = (focused: boolean, isDarkMode: boolean) => {
  return {
    color: focused
      ? (isDarkMode ? '#4285f4' : '#4285f4') // Active color
      : (isDarkMode ? '#fff' : '#88888'), // Inactive color
    size: 24, // Icon size
  };
};

// Reusable Header Icon Component
const HeaderIcon = ({
  name,
  onPress,
  isDarkMode,
}: {
  name: keyof typeof Ionicons.glyphMap; // Restrict name to valid Ionicons names
  onPress: () => void;
  isDarkMode: boolean;
}) => (
  <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 15 }}>
    <Ionicons name={name} size={24} color={isDarkMode ? '#fff' : '#88888'} />
  </TouchableOpacity>
);

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
            ...(isDarkMode ? darkTabScreenOptions : lightTabScreenOptions),
            tabBarShowLabel: false,
            tabBarStyle: {
              marginTop: 10,
              height: 85,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode
                ? globalStyles.darkContainer.backgroundColor
                : globalStyles.lightContainer.backgroundColor,
              borderTopWidth: 0,
            },
            headerStyle: {
              height: 110,
              backgroundColor: isDarkMode
                ? globalStyles.darkContainer.backgroundColor
                : globalStyles.lightContainer.backgroundColor,
              borderBottomWidth: 0,
            },
            headerLeft: () => {
              const router = useRouter();
              const handleProfile = () => {
                router.push('/profile');
              };
              return (
                <HeaderIcon
                  name="person-outline"
                  onPress={handleProfile}
                  isDarkMode={isDarkMode}
                />
              );
            },
            headerRight: () => {
              const router = useRouter();
              const handleLogout = () => {
                router.replace('/');
              };
              return (
                <HeaderIcon
                  name="log-out-outline"
                  onPress={handleLogout}
                  isDarkMode={isDarkMode}
                />
              );
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ focused }) => {
                const { color, size } = getIconProps(focused, isDarkMode);
                return <Ionicons name="home-outline" size={size} color={color} />;
              },
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ focused }) => {
                const { color, size } = getIconProps(focused, isDarkMode);
                return <Ionicons name="stats-chart-outline" size={size} color={color} />;
              },
            }}
          />
          <Tabs.Screen
            name="assets"
            options={{
              title: 'Assets',
              tabBarIcon: ({ focused }) => {
                const { color, size } = getIconProps(focused, isDarkMode);
                return <Ionicons name="wallet-outline" size={size} color={color} />;
              },
            }}
          />
          <Tabs.Screen
            name="events"
            options={{
              title: 'Events',
              tabBarIcon: ({ focused }) => {
                const { color, size } = getIconProps(focused, isDarkMode);
                return <Ionicons name="calendar-outline" size={size} color={color} />;
              },
            }}
          />
        </Tabs>
      </View>
    </>
  );
}