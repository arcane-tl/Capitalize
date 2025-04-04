import React, { useState } from 'react';
import { Text, TextStyle, View, TouchableOpacity, Modal, Switch, ViewStyle, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { globalStyles, profileStyles, colors } from '../components/css/styles';
import { useUserPreferences } from '../constants/userPreferences';
import { getAuth, signOut } from 'firebase/auth';
import { addAuditLogEntry } from '../components/firebaseAPI';
import { getStyle } from '@/components/themeUtils';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const IconButton = ({
  iconName,
  text,
  onPress,
  isDarkMode,
  style,
}: {
  iconName: IoniconsName;
  text: string;
  onPress: () => void;
  isDarkMode: boolean;
  style?: ViewStyle;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      profileStyles.buttonContainer,
      style,
      {
        backgroundColor: getStyle('Background', colors),
      },
    ]}
  >
    <Ionicons
      name={iconName}
      size={24}
      color={getStyle('IconOutline', colors)}
    />
    <Text
      style={[
        profileStyles.buttonText,
        { color: getStyle('IconOutline', colors) },
      ]}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

const CustomModal = ({
  visible,
  onClose,
  children,
  isDarkMode,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isDarkMode: boolean;
}) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={profileStyles.modalContainer}>
      <View
        style={[
          profileStyles.modalContent,
          { backgroundColor: getStyle('Background', colors) },
        ]}
      >
        {children}
        <TouchableOpacity onPress={onClose}>
          <Text
            style={[
              profileStyles.modalCloseText,
              { color: getStyle('IconOutline', colors) },
            ]}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, setTheme } = useUserPreferences();
  const isDarkMode = theme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const goBack = () => router.replace('/home');
  const toggleDarkMode = (value: boolean) => setTheme(value ? 'dark' : 'light');

  const handleLogout = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error('No user is currently logged in.');
      return;
    }
  
    const uid = user.uid;
    const logoutLogEntry = {
      name: 'Logout',
      time: Date.now(),
      status: '',
    };
  
    try {
      // Attempt to log the logout event with a "success" status
      logoutLogEntry.status = 'success';
      await addAuditLogEntry(uid, logoutLogEntry);
  
      // Sign out the user
      await signOut(auth);
  
      // Redirect to the login screen
      router.replace('/');
    } catch (error: any) {
      // Log the logout event with a "failure" status
      logoutLogEntry.status = 'failure';

      await addAuditLogEntry(uid, logoutLogEntry);
  
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
    }
  };
  
  const iconColor = getStyle('IconOutline', colors);
  
  // Button configuration array
  const buttons = [
    {
      iconName: 'settings-outline' as IoniconsName,
      text: 'Profile Settings',
      onPress: () => setSettingsModalVisible(true),
      style: { alignSelf: 'flex-start', marginTop: 40, marginBottom: 40, } as ViewStyle,
    },
    {
      iconName: 'moon-outline' as IoniconsName,
      text: 'Theme',
      onPress: () => setModalVisible(true),
      style: { alignSelf: 'flex-start', marginTop: 0, } as ViewStyle,
    },
    {
      iconName: 'log-out-outline' as IoniconsName,
      text: 'Logout',
      onPress: handleLogout,
      style: { alignSelf: 'center', marginTop: 'auto', marginBottom: 80, } as ViewStyle,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: getStyle('Background', colors),
          },
          headerRight: () => (
            <TouchableOpacity onPress={goBack} style={{ marginRight: 20 }}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View
        style={[
          getStyle('Container', globalStyles) as ViewStyle,
          {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          },
        ]}
      >
        <View style={globalStyles.profileContainer}>
          {buttons.map((button, index) => (
            <IconButton
              key={index}
              iconName={button.iconName}
              text={button.text}
              onPress={button.onPress}
              isDarkMode={isDarkMode}
              style={button.style}
            />
          ))}

          {/* Modals */}
          <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} isDarkMode={isDarkMode}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[
                  { marginRight: 10 },
                  { color: getStyle('Text', colors) },
                ]}
              >
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                thumbColor={getStyle('IconOutline', colors)}
                trackColor={{ false: colors.lightBorderColor, true: colors.darkBorderColor }}
              />
            </View>
          </CustomModal>

          <CustomModal
            visible={settingsModalVisible}
            onClose={() => setSettingsModalVisible(false)}
            isDarkMode={isDarkMode}
          >
            <Text
              style={[
                { marginBottom: 20 },
                getStyle('Text', globalStyles) as TextStyle,
              ]}
            >
              Settings Modal Content
            </Text>
          </CustomModal>
        </View>
      </View>
    </>
  );
}