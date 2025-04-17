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
import { create } from 'zustand';

interface AssetStore {
  refreshAssets: boolean;
  toggleRefreshAssets: () => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  refreshAssets: false,
  toggleRefreshAssets: () => set((state) => ({ refreshAssets: !state.refreshAssets })),
}));

export default function AddAssetModal({ closeModal }: { closeModal: () => void }) {
  const [assetName, setAssetName] = useState<string>('');
  const [assetDescription, setDescription] = useState<string>('');
  const [assetPurchasePrice, setAssetPurchasePrice] = useState<string>('');
  const [assetCurrentValue, setAssetCurrentValue] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null); // Store original filename
  const [imageType, setImageType] = useState<string | null>(null); // Store original filetype
  const [uploading, setUploading] = useState<boolean>(false);
  const userUID = useUserStore((state) => state.user?.uid);
  const toggleRefreshAssets = useAssetStore((state) => state.toggleRefreshAssets);

  const assetPath = `users/${userUID}/assets`;
  const userFilePath = `users/${userUID}/assets`;

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
        quality: 0.2,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageName(asset.fileName || `image_${Date.now()}`); // Use original filename or fallback
        setImageType(asset.type || 'image/jpeg'); // Use original type or default to JPEG
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
    const assetUID = assetRef.key;
    const saveFilePath = `${userFilePath}/${assetUID}/files`;
  
    try {
      let filePath = '';
      let imageUrl = '';

      if (imageUri && imageName) {
        setUploading(true);
        // Use the original filename and type
        filePath = `${saveFilePath}/${imageName}`;
        const uploadResult = await uploadFile(imageUri, imageName, userUID, saveFilePath, imageType);
        if (!uploadResult.downloadURL || typeof uploadResult.downloadURL !== 'string') {
          throw new Error('Failed to get a valid download URL from upload.');
        }
        imageUrl = uploadResult.downloadURL;
        setUploading(false);
      }
  
      const assetData = {
        created: Date.now(),
        name: assetName,
        description: assetDescription,
        purchasePrice: parseFloat(assetPurchasePrice) || 0,
        currentValue: parseFloat(assetCurrentValue) || 0,
        files: imageUri
          ? {
              mainPicture: {
                path: filePath,
                url: imageUrl,
                type: imageType || 'image/jpeg',
                name: imageName, // Store original filename
              },
            }
          : {},
      };
  
      await set(ref(db, `${assetPath}/${assetUID}`), assetData);
  
      Alert.alert('Asset Saved', 'Your asset has been successfully saved.', [
        {
          text: 'OK',
          onPress: () => {
            toggleRefreshAssets();
            closeModal();
          },
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
        <View style={assetModalStyles.headerContainer}>
          <View style={assetModalStyles.headerLeft}>
            <TouchableOpacity
              onPress={closeModal}
              style={[assetModalStyles.cancelButton, { borderColor: buttonOutlineColor }]}
            >
              <Text style={textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={assetModalStyles.headerCenter}>
            <Text style={[assetModalStyles.modalTitleText, textStyle]}>New Asset</Text>
          </View>
          <View style={assetModalStyles.headerRight}>
            <TouchableOpacity
              onPress={saveAsset}
              style={[assetModalStyles.cancelButton, { borderColor: buttonOutlineColor }]}
              disabled={uploading}
            >
              <Text style={textStyle}>{uploading ? 'Saving...' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

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
          <TextInput
            style={[
              globalStyles.base.input as TextStyle,
              inputStyle,
              { width: '90%', height: 50, borderRadius: 10 },
            ]}
            placeholder="Current Value"
            placeholderTextColor={placeholderTextColor}
            value={assetCurrentValue}
            onChangeText={setAssetCurrentValue}
            keyboardType="decimal-pad"
            autoCapitalize="none"
            editable={true}
          />

          <TouchableOpacity
            onPress={pickImage}
            style={[assetModalStyles.uploadButton, { borderColor: buttonOutlineColor }]}
          >
            <Text style={textStyle}>{imageUri ? 'Change Image' : 'Upload Image'}</Text>
          </TouchableOpacity>
          {imageUri && imageName && (
            <Text style={[textStyle, { marginTop: 10 }]}>
              Selected Image: {imageName}
            </Text>
          )}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 150,
                height: 150,
                marginTop: 10,
                borderRadius: 10,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}