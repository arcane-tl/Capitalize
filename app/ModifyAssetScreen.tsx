import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, deleteObject, getMetadata } from 'firebase/storage';
import { fetchAssetData, fetchAssetCategories, uploadFile, updateAsset } from '@/components/FirebaseAPI';
import { useThemeStyles } from '@/components/ThemeUtils';

// Define interfaces
interface FileType {
  id?: string;
  name: string | null;
  uri?: string;
  url?: string;
  path?: string;
  type?: string;
}

interface AssetFormData {
  name: string;
  description: string;
  debt: string;
  maintenanceCost: string;
  category: string;
}

interface FileMetadata {
  name: string;
  url: string;
  path: string;
  type: string | null;
}

interface AssetData extends AssetFormData {
  files: { [key: string]: FileMetadata };
}

// Separate AssetForm component
const AssetForm = ({ formData, handleInputChange, categories, textStyle }: {
  formData: AssetFormData;
  handleInputChange: (field: keyof AssetFormData, value: string) => void;
  categories: string[];
  textStyle: any;
}) => (
  <>
    <Text style={textStyle}>Name</Text>
    <TextInput
      style={{ color: textStyle.color as string, borderRadius: 10, padding: 5, backgroundColor: 'rgba(184, 184, 184, 0.73)', marginBottom: 15 }}
      value={formData.name}
      onChangeText={(text) => handleInputChange('name', text)}
    />
    <Text style={textStyle}>Description</Text>
    <TextInput
      style={{ color: textStyle.color as string, borderRadius: 10, padding: 5, backgroundColor: 'rgba(184, 184, 184, 0.73)', marginBottom: 15, }}
      value={formData.description}
      multiline
      numberOfLines={4}
      onChangeText={(text) => handleInputChange('description', text)}
    />
    <Text style={textStyle}>Debt</Text>
    <TextInput
      style={{ color: textStyle.color as string, borderBottomWidth: 1, marginBottom: 15 }}
      value={formData.debt}
      onChangeText={(text) => handleInputChange('debt', text)}
      keyboardType="numeric"
    />
    <Text style={textStyle}>Monthly Maintenance Cost</Text>
    <TextInput
      style={{ color: textStyle.color as string, borderBottomWidth: 1, marginBottom: 15 }}
      value={formData.maintenanceCost}
      onChangeText={(text) => handleInputChange('maintenanceCost', text)}
      keyboardType="numeric"
    />
    <Text style={textStyle}>Category</Text>
    <Picker
      selectedValue={formData.category}
      onValueChange={(itemValue) => handleInputChange('category', itemValue as string)}
      style={{ color: textStyle.color as string, marginBottom: 15 }}
    >
      <Picker.Item label="Select a category" value="" />
      {categories.map((cat, index) => (
        <Picker.Item key={index} label={cat} value={cat} />
      ))}
    </Picker>
  </>
);

export default function ModifyAssetScreen() {
  const router = useRouter();
  const { assetId } = useLocalSearchParams();
  const assetIdString = Array.isArray(assetId) ? assetId[0] : assetId || '';
  const { backgroundColor, textStyle, buttonOutlineColor, headerTitleStyle } = useThemeStyles();

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  if (!uid) {
    Alert.alert('Error', 'User not authenticated');
    router.replace('/Login');
    return null;
  }

  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    debt: '',
    maintenanceCost: '',
    category: '',
  });
  const [existingFiles, setExistingFiles] = useState<FileType[]>([]);
  const [newFiles, setNewFiles] = useState<FileType[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inside useEffect hook for loading asset data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const asset = await fetchAssetData(uid, assetIdString) as AssetData;
        setFormData({
          name: asset.name || '',
          description: asset.description || '',
          debt: asset.debt || '',
          maintenanceCost: asset.maintenanceCost || '',
          category: asset.category || '',
        });
        const expectedPrefix = `users/${uid}/assets/${assetIdString}/files/`;
        const filesArray = Object.entries(asset.files || {})
          .map(([id, file]) => ({
            id,
            name: file.name || null,
            url: file.url || undefined,
            path: file.path || undefined,
            type: file.type || undefined,
          }))
          .filter(file => file.path?.startsWith(expectedPrefix));
        setExistingFiles(filesArray);
        const cats = await fetchAssetCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading asset data:', error);
        Alert.alert('Error', 'Failed to load asset data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (assetIdString) {
      loadData();
    }
  }, [uid, assetIdString]);

  const handleInputChange = (field: keyof AssetFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const file: FileType = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || undefined,
        };
        setNewFiles([...newFiles, file]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = (fileId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this file? This action cannot be undone after saving.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setFilesToDelete([...filesToDelete, fileId]) },
      ]
    );
  };

  const isValidNumber = (value: string) => !isNaN(parseFloat(value)) && isFinite(parseFloat(value));

  // Verify file existence in Firebase Storage
  const verifyStorageFiles = async (files: FileType[]): Promise<FileType[]> => {
    const storage = getStorage();
    const validFiles: FileType[] = [];
    const expectedPrefix = `users/${uid}/assets/${assetIdString}/files/`;
    for (const file of files) {
      if (file.path && file.id && file.path.startsWith(expectedPrefix)) {
        try {
          await getMetadata(storageRef(storage, file.path));
          validFiles.push(file);
        } catch (error) {
          console.warn(`File not found in storage: ${file.path}`);
        }
      } else {
        console.warn(`File path does not match expected prefix: ${file.path}`);
      }
    }
    return validFiles;
  };

  // Save form data (non-file fields)
  const saveFormData = async () => {
    try {
      const updatedAssetData = { ...formData };
      await updateAsset(uid, assetIdString, updatedAssetData);
    } catch (error) {
      console.error('Error saving form data:', error);
      throw new Error('Failed to save form data');
    }
  };

  // Handle file deletions and uploads within the specified path
  const saveFileOperations = async () => {
    const storage = getStorage();
    const updatedFiles: { [key: string]: { name: string; url: string; path: string; type: string | null } } = {};

    // Delete marked files from storage
    for (const fileId of filesToDelete) {
      const file = existingFiles.find((f) => f.id === fileId);
      if (file && file.path) {
        try {
          await deleteObject(storageRef(storage, file.path));
        } catch (error) {
          console.warn(`Failed to delete file: ${file.path}`, error);
        }
      }
    }

    // Verify existing files (exclude deleted ones)
    const filesToKeep = existingFiles.filter((file) => file.id && !filesToDelete.includes(file.id));
    const verifiedFiles = await verifyStorageFiles(filesToKeep);
    verifiedFiles.forEach((file) => {
      if (file.id && file.url && file.path) {
        updatedFiles[file.id] = {
          name: file.name || 'Undefined',
          url: file.url,
          path: file.path,
          type: file.type || null,
        };
      }
    });

    // Upload new files to the specified Firebase Storage path
    for (const file of newFiles) {
      try {
        const result = await uploadFile(
          file.uri!,
          file.name!,
          uid,
          `users/${uid}/assets/${assetIdString}/files`,
          file.type,
          assetIdString,
          true
        );
        const { fileId, fileData } = result;
        if (fileId && fileData) {
          updatedFiles[fileId] = fileData;
        } else {
          throw new Error(`Failed to upload file: ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading file: ${file.name}`, error);
        throw error;
      }
    }

    // Update asset with new file data
    try {
      await updateAsset(uid, assetIdString, { files: updatedFiles });
    } catch (error) {
      console.error('Error updating file data:', error);
      throw new Error('Failed to update file data');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Invalid Input', 'Name is required.');
      return;
    }
    if (formData.debt && !isValidNumber(formData.debt)) {
      Alert.alert('Invalid Input', 'Debt must be a valid number.');
      return;
    }
    if (formData.maintenanceCost && !isValidNumber(formData.maintenanceCost)) {
      Alert.alert('Invalid Input', 'Maintenance Cost must be a valid number.');
      return;
    }
    if (!formData.category) {
      Alert.alert('Invalid Input', 'Please select a category.');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Save form data
      await saveFormData();
      
      // Step 2: Handle file operations if there are changes
      if (filesToDelete.length > 0 || newFiles.length > 0) {
        await saveFileOperations();
      }

      Alert.alert('Success', 'Asset updated successfully');
      router.replace('/(tabs)/AssetsScreen');
    } catch (error) {
      console.error('Error saving asset:', error);
      Alert.alert('Error', 'Failed to save asset. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const buttonStyle = {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    borderColor: buttonOutlineColor,
  };

  const safeHeaderTitleStyle = {
    fontSize: headerTitleStyle.fontSize,
    fontWeight: headerTitleStyle.fontWeight,
    fontFamily: headerTitleStyle.fontFamily,
    color: headerTitleStyle.color as string,
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: formData.name || 'Modify Asset',
          headerTitleStyle: safeHeaderTitleStyle,
          headerStyle: { backgroundColor },
          headerTintColor: textStyle.color as string,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={buttonStyle}>
              <Text style={textStyle}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={{ ...buttonStyle, marginRight: 10 }}>
              <Text style={textStyle}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ backgroundColor, padding: 20 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={textStyle.color} style={{ marginVertical: 20 }} />
        ) : (
          <>
            <AssetForm
              formData={formData}
              handleInputChange={handleInputChange}
              categories={categories}
              textStyle={textStyle}
            />
            <Text style={textStyle}>Files</Text>
            {existingFiles
              .filter((file) => file.id && !filesToDelete.includes(file.id))
              .map((file, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                  <Text style={textStyle}>{file.name}</Text>
                  <TouchableOpacity onPress={() => file.id && handleDeleteExistingFile(file.id)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            {newFiles.map((file, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                <Text style={textStyle}>{file.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveNewFile(index)}>
                  <Text style={{ color: 'red' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={handleAddFile} style={{ ...buttonStyle, marginTop: 10 }}>
              <Text style={textStyle}>Add File</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}