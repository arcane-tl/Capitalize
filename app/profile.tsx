import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Switch, ViewStyle, TextStyle } from 'react-native'; // Added ViewStyle and TextStyle
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { globalStyles } from '../components/css/styles';
import { useUserPreferences } from '../constants/userPreferences';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, setTheme } = useUserPreferences(); // Access and update the theme preference
  const isDarkMode = theme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const goBack = () => {
    router.replace('/home');
  };

  const toggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light'); // Toggle between dark and light themes
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: isDarkMode
              ? (globalStyles.darkContainer.backgroundColor as string)
              : (globalStyles.lightContainer.backgroundColor as string),
          },
          headerRight: () => (
            <TouchableOpacity onPress={goBack} style={{ marginRight: 20 }}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={isDarkMode ? '#fff' : '#4285f4'}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View
        style={[
          isDarkMode
            ? (globalStyles.darkContainer as ViewStyle) // Explicitly cast to ViewStyle
            : (globalStyles.lightContainer as ViewStyle), // Explicitly cast to ViewStyle
          {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          },
        ]}
      >
        <View style={[globalStyles.container as ViewStyle]}>
          <TouchableOpacity
            onPress={navigateToSettings}
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginBottom: 20,
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#4285f4'}
            />
            <Text
              style={[
                isDarkMode
                  ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
                  : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
                { marginLeft: 10 },
              ]}
            >
              Profile Settings
            </Text>
          </TouchableOpacity>

          {/* Theme Selection Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Ionicons
              name="moon-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#4285f4'}
            />
            <Text
              style={[
                isDarkMode
                  ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
                  : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
                { marginLeft: 10 },
              ]}
            >
              Theme
            </Text>
          </TouchableOpacity>

          {/* Theme Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View
                style={{
                  width: 300,
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  borderRadius: 10,
                  padding: 20,
                  alignItems: 'center',
                }}
              >
                {/* Dark Mode Toggle */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={[
                      isDarkMode
                        ? (globalStyles.darkText as TextStyle) // Explicitly cast to TextStyle
                        : (globalStyles.lightText as TextStyle), // Explicitly cast to TextStyle
                      { marginRight: 10 },
                    ]}
                  >
                    Dark Mode
                  </Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? '#fff' : '#4285f4'}
                    trackColor={{ false: '#ccc', true: '#555' }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 20 }}
                >
                  <Text
                    style={{
                      color: isDarkMode ? '#fff' : '#4285f4',
                      fontWeight: 'bold',
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </>
  );
}