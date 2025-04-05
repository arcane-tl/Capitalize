import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StatusBar, View, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '@/components/ThemeUtils';
import { useUserPreferences } from '@/constants/userPreferences';
import AddAssetModal from '@/app/modals/AddAsset';

// Reusable Header Icon Component
const HeaderIcon = ({
  name,
  onPress,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
}) => (
  <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 15 }}>
    <Ionicons name={name} size={24} color={color} />
  </TouchableOpacity>
);

export default function TabsLayout() {
  const { theme } = useUserPreferences();
  const themeStyles = useThemeStyles();
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <StatusBar barStyle={themeStyles.statusBarStyle} />
      <View style={[themeStyles.containerStyle, { flex: 1 }]}>
        <Tabs
          screenOptions={{
            tabBarStyle: themeStyles.TabScreenStyle.tabBarStyle,
            headerStyle: themeStyles.TabScreenStyle.headerStyle,
            headerTintColor: themeStyles.TabScreenStyle.headerTintColor,
            tabBarActiveTintColor: themeStyles.TabScreenStyle.tabBarActiveTintColor,
            tabBarInactiveTintColor: themeStyles.TabScreenStyle.tabBarInactiveTintColor,
            tabBarShowLabel: themeStyles.TabScreenStyle.tabBarShowLabel,
            headerLeft: () => {
              const router = useRouter();
              const handleProfile = () => {
                router.push('/Profile');
              };
              return (
                <HeaderIcon
                  name="person-outline"
                  onPress={handleProfile}
                  color={themeStyles.iconOutlineColor}
                />
              );
            },
          }}
        >
          <Tabs.Screen
            name="HomeScreen"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="DashboardScreen"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="AssetsScreen"
            options={{
              title: 'Assets',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="wallet-outline" size={size} color={color} />
              ),
              headerRight: () => (
                <HeaderIcon
                  name="add-outline"
                  onPress={openModal}
                  color={themeStyles.iconOutlineColor}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="EventsScreen"
            options={{
              title: 'Events',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
        {/* Modal Component */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <AddAssetModal closeModal={closeModal} />
        </Modal>
      </View>
    </>
  );
}