import React, { useState } from 'react';
import { Text, TextStyle, View, TouchableOpacity, Modal, Switch, ViewStyle, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useThemeStyles } from '@/components/ThemeUtils';
import { profileStyles } from '@/components/css/CustomStyles';
import { useUserPreferences } from '@/constants/userPreferences';
import { getAuth, signOut } from 'firebase/auth';
import { addAuditLogEntry } from '@/components/FirebaseAPI';
import { colors } from '@/components/css/Styles';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const IconButton = ({
  iconName,
  text,
  onPress,
  backgroundColor,
  textColor,
  style,
}: {
  iconName: IoniconsName;
  text: string;
  onPress: () => void;
  backgroundColor: string;
  textColor?: string;
  style?: ViewStyle;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      profileStyles.buttonContainer,
      style,
      { backgroundColor },
    ]}
  >
    <Ionicons name={iconName} size={24} color={textColor} />
    <Text style={[profileStyles.buttonText, { color: textColor }]}>{text}</Text>
  </TouchableOpacity>
);

const CustomModal = ({
  visible,
  onClose,
  children,
  backgroundColor,
  textStyle,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor: string;
  textStyle: TextStyle;
}) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={profileStyles.modalContainer}>
      <View style={[profileStyles.modalContent, { backgroundColor }]}>
        {children}
        <TouchableOpacity onPress={onClose}>
          <Text style={[profileStyles.modalCloseText, textStyle]}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function ProfilesScreen() {
  const router = useRouter();
  const { theme, setTheme } = useUserPreferences();
  const isDarkMode = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  console.log('Current theme:', theme);

  const { containerStyle, textStyle, backgroundColor, iconOutlineColor, borderColor } = useThemeStyles();
  const goBack = () => router.replace('/HomeScreen');
  const toggleDarkMode = (value: boolean) => setTheme(value ? 'dark' : 'light');

  console.log('textStyle:', textStyle);
  console.log('containerStyle:', containerStyle);

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
      logoutLogEntry.status = 'success';
      await addAuditLogEntry(uid, logoutLogEntry);
      await signOut(auth);
      router.replace('/');
    } catch (error: any) {
      logoutLogEntry.status = 'failure';
      await addAuditLogEntry(uid, logoutLogEntry);
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
    }
  };

  const buttons = [
    {
      iconName: 'settings-outline' as IoniconsName,
      text: 'Profile Settings',
      onPress: () => setSettingsModalVisible(true),
      style: { alignSelf: 'flex-start', marginTop: 40, marginBottom: 40, marginLeft: 20, } as ViewStyle,
    },
    {
      iconName: 'moon-outline' as IoniconsName,
      text: 'Theme',
      onPress: () => setModalVisible(true),
      style: { alignSelf: 'flex-start', marginTop: 0, marginLeft: 20, } as ViewStyle,
    },
    {
      iconName: 'log-out-outline' as IoniconsName,
      text: 'Logout',
      onPress: handleLogout,
      style: { alignSelf: 'center', marginTop: 'auto', marginBottom: 80 } as ViewStyle,
    },
  ];

  return (
    <>
      <Stack.Screen
        name = 'Profile'
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor,
          },
          headerRight: () => (
            <TouchableOpacity onPress={goBack} style={{ marginRight: 0 }}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={iconOutlineColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View
        style={[
          containerStyle,
          {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          },
        ]}
      >
        {buttons.map((button, index) => (
          <IconButton
            key={index}
            iconName={button.iconName}
            text={button.text}
            onPress={button.onPress}
            backgroundColor={backgroundColor}
            textColor={textStyle.color as string | undefined}
            style={button.style}
          />
        ))}

        {/* Theme Modal */}
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          backgroundColor={backgroundColor}
          textStyle={textStyle}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                { marginRight: 10 },
                textStyle,
              ]}
            >
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={iconOutlineColor}
              trackColor={{ false: borderColor, true: colors.primary }}
            />
          </View>
        </CustomModal>

        {/* Settings Modal */}
        <CustomModal
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
          backgroundColor={backgroundColor}
          textStyle={textStyle}
        >
          <Text
            style={[
              { marginBottom: 20 },
              textStyle,
            ]}
          >
            Settings Modal Content
          </Text>
        </CustomModal>
      </View>
    </>
  );
}