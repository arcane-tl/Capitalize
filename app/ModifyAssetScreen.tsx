import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const asset = await fetchAssetData(uid, assetIdString) as AssetData;
        setFormData({
          name: asset.name || '',
          description: asset.description || '',
          debt: asset.debt || '',
          maintenanceCost: asset.maintenanceCost || '',
          category: asset.category || '',
        });
        const filesArray = Object.entries(asset.files || {}).map(([id, file]) => ({
          id,
          name: file.name || null,
          url: file.url || undefined,
          path: file.path || undefined,
          type: file.type || undefined,
        }));
        setExistingFiles(filesArray);
        const cats = await fetchAssetCategories();
        setCategories(cats);
      } catch (error) {
        Alert.alert('Error', 'Failed to load asset data');
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
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = (fileId: string) => {
    setFilesToDelete([...filesToDelete, fileId]);
  };

  const handleSave = async () => {
    try {
      const storage = getStorage();
      for (const fileId of filesToDelete) {
        const file = existingFiles.find((f) => f.id === fileId);
        if (file && file.path) {
          await deleteObject(storageRef(storage, file.path));
        }
      }

      const updatedFiles: { [key: string]: { name: string; url: string; path: string; type: string | null } } = {};

      existingFiles.forEach((file) => {
        if (file.id && !filesToDelete.includes(file.id) && file.url && file.path) {
          updatedFiles[file.id] = {
            name: file.name || 'Undefined',
            url: file.url,
            path: file.path,
            type: file.type || null,
          };
        }
      });

      for (const file of newFiles) {
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
          throw new Error('Failed to upload file and add to database');
        }
      }

      const updatedAssetData = {
        ...formData,
        files: updatedFiles,
      };

      await updateAsset(uid, assetIdString, updatedAssetData);

      Alert.alert('Success', 'Asset updated successfully');
      router.replace('/(tabs)/AssetsScreen');
    } catch (error) {
      console.error('Error saving asset:', error);
      Alert.alert('Error', 'Failed to save asset');
    }
  };

  const handleCancel = () => {
    router.replace('/(tabs)/AssetsScreen');
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
        <Text style={textStyle}>Name</Text>
        <TextInput
          style={{ color: textStyle.color as string, borderBottomWidth: 1, marginBottom: 15 }}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        <Text style={textStyle}>Description</Text>
        <TextInput
          style={{ color: textStyle.color as string, borderBottomWidth: 1, marginBottom: 15 }}
          value={formData.description}
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
      </ScrollView>
    </>
  );
}