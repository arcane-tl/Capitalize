import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useThemeStyles } from '@/components/ThemeUtils';

export default function ModifyAssetScreen() {
  const router = useRouter();
  const { backgroundColor, textStyle, buttonOutlineColor, headerTitleStyle } = useThemeStyles();

  // Cancel action: Navigate back to AssetsScreen.tsx
  const handleCancel = () => {
    router.replace('/(tabs)/AssetsScreen');
  };

  // Save action: Placeholder for saving to Firebase
  const handleSave = () => {
    // TODO: Implement logic to save modified asset data to Firebase
    Alert.alert('Save', 'Asset changes will be saved to Firebase (implementation pending).');
  };

  // Button styles matching AddAsset.tsx
  const buttonStyle = {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    borderColor: buttonOutlineColor,
  };

  const cancelButtonStyle = {
    ...buttonStyle,
  };

  const saveButtonStyle = {
    ...buttonStyle,
    marginRight: 10, // Add right margin for headerRight
  };

  return (
    <>
      <Stack.Screen
        name="ModifyAssetScreen"
        options={{
          headerShown: true,
          headerTitle: 'Modify Asset', // Replace with dynamic assetName if available
          headerTitleStyle: headerTitleStyle as any,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: textStyle.color as string,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={cancelButtonStyle}>
              <Text style={textStyle}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={saveButtonStyle}>
              <Text style={textStyle}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <Text style={textStyle}>Modify Asset Screen</Text>
        {/* Add your form fields here to edit asset details */}
      </View>
    </>
  );
}