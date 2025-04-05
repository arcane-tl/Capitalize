import React, { useState } from 'react';
import { View, Text, TextStyle, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { assetModalStyles } from '@/components/css/CustomStyles';
import { globalStyles } from '@/components/css/Styles';
import { useThemeStyles } from '@/components/ThemeUtils';
import { uploadFile } from '@/components/FirebaseAPI';
import { ref, set, push } from 'firebase/database';
import { database } from '@/components/database/FirebaseConfig';
import { useUserStore } from '@/constants/userStore';
import { getAuth } from 'firebase/auth';

export default function AddAssetModal({ closeModal }: { closeModal: () => void }) {
  const [assetName, setAssetName] = useState<string>('');
  const [assetDescription, setDescription] = useState<string>('');
  const [assetPurchasePrice, setAssetPurchasePrice] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const userUID = useUserStore((state) => state.user?.uid);

  // Database path for user assets
  const assetPath = `users/${userUID}/assets`;
  const userFilePath = `users/${userUID}/assets`;

  // Get precomputed styles from the custom hook
  const {
    backgroundColor,
    textStyle,
    inputStyle,
    placeholderTextColor,
    buttonOutlineColor,
  } = useThemeStyles();

  // Function to pick an image from the device
  async function pickImage(): Promise<void> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.2, // Adjust the image quality as needed 0 (lowest) to 1 (highest)
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  }

  // Function to save the asset
  async function saveAsset(): Promise<void> {
    if (!userUID) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }

    const db = database;
    const assetRef = push(ref(db, assetPath));
    const assetUid = assetRef.key;

    const auth = getAuth();

    try {
      let imageUrl = '';
      if (imageUri) {
        setUploading(true);
        const fileName = `${assetName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;

        // Upload the file to Firebase Storage
        imageUrl = await uploadFile(imageUri, fileName, userUID, userFilePath);

        setUploading(false);
      }

      // Prepare asset data
      const assetData = {
        name: assetName,
        description: assetDescription,
        purchasePrice: assetPurchasePrice,
        assetPictureLink: imageUrl,
      };

      // Save asset data to Firebase Realtime Database
      await set(ref(db, `${assetPath}/${assetUid}`), assetData);

      Alert.alert('Asset Saved', `Your asset has been successfully saved.\nImage URL: ${imageUrl}`, [
        {
          text: 'OK',
          onPress: () => closeModal(),
        },
      ]);
    } catch (error) {
      setUploading(false);
      console.error('Error saving asset:', error);
      Alert.alert('Error', 'Failed to save asset. Please try again.');
    }
  }

  return (
    <View style={assetModalStyles.mainContainer}>
      <View style={[assetModalStyles.contentContainer, { backgroundColor }]}>
        {/* Header Container */}
        <View style={assetModalStyles.headerContainer}>
          <View style={assetModalStyles.headerLeft}>
            <TouchableOpacity onPress={closeModal} style={assetModalStyles.cancelButton}>
              <Text style={textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={assetModalStyles.headerCenter}>
            <Text style={[assetModalStyles.modalTitleText, textStyle]}>New Asset</Text>
          </View>
          <View style={assetModalStyles.headerRight}>
            <TouchableOpacity onPress={saveAsset} style={assetModalStyles.addButton} disabled={uploading}>
              <Text style={textStyle}>{uploading ? 'Saving...' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={assetModalStyles.innerContentContainer}>
          <TextInput
            style={[
              globalStyles.base.input as TextStyle,
              inputStyle,
              { width: '90%', height: 50, borderRadius: 10 },
            ]}
            placeholder="Name"
            placeholderTextColor={placeholderTextColor}
            value={assetName}
            onChangeText={setAssetName}
            keyboardType="default"
            autoCapitalize="none"
            editable={true}
          />
          <TextInput
            style={[
              globalStyles.base.input as TextStyle,
              inputStyle,
              { width: '90%', height: 150, borderRadius: 10, textAlignVertical: 'top' },
            ]}
            placeholder="Description"
            placeholderTextColor={placeholderTextColor}
            value={assetDescription}
            onChangeText={setDescription}
            keyboardType="default"
            autoCapitalize="none"
            editable={true}
            multiline={true}
            maxLength={160}
          />
          <TextInput
            style={[
              globalStyles.base.input as TextStyle,
              inputStyle,
              { width: '90%', height: 50, borderRadius: 10 },
            ]}
            placeholder="Purchase Price"
            placeholderTextColor={placeholderTextColor}
            value={assetPurchasePrice}
            onChangeText={setAssetPurchasePrice}
            keyboardType="decimal-pad"
            autoCapitalize="none"
            editable={true}
          />

          {/* Image Picker */}
          <TouchableOpacity onPress={pickImage}
            style={[
              assetModalStyles.uploadButton,
              { borderColor: buttonOutlineColor },
            ]}>
            <Text style={textStyle}>
              {imageUri ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>
          {imageUri && (
            <Text style={[textStyle, { marginTop: 10 }]}>
              Selected Image: {imageUri.split('/').pop()}
            </Text>
          )}
          {/* Display the selected image */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 150, // Adjust the width as needed
                height: 150, // Adjust the height as needed
                marginTop: 10,
                borderRadius: 10, // Optional: Add rounded corners
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}