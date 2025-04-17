import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { getAuth } from 'firebase/auth';
import { fetchAssetData, fetchAssetCategories, updateAsset, updateAssetFiles } from '@/components/FirebaseAPI';
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
  monthlyCost: string;
  category: string;
  purchasePrice: string;
  currentValue: string;
}

interface FileMetadata {
  name: string;
  url: string;
  path: string;
  type: string | null;
}

interface AssetData {
  name: string;
  description: string;
  debt?: number;
  monthlyCost?: number;
  category: string;
  purchasePrice?: number;
  currentValue?: number;
  files: { [key: string]: FileMetadata };
}

// Separate AssetForm component
const AssetForm = ({ formData, handleInputChange, categories, textStyle, buttonOutlineColor }: {
  formData: AssetFormData;
  handleInputChange: (field: keyof AssetFormData, value: string) => void;
  categories: string[];
  textStyle: any;
  buttonOutlineColor: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectCategory = (category: string) => {
    handleInputChange('category', category);
    setModalVisible(false);
  };

  return (
    <>
      <View style={{ 
        borderWidth: 1, 
        borderColor: textStyle.color as string, 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 15 
      }}>
        <Text style={textStyle}>Name</Text>
        <TextInput
          style={{ 
            color: textStyle.color as string, 
            borderRadius: 10, 
            padding: 5, 
            backgroundColor: 'rgba(184, 184, 184, 0.73)', 
            marginTop: 5 
          }}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
      </View>
      <View style={{ 
        borderWidth: 1, 
        borderColor: textStyle.color as string, 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 15 
      }}>
        <Text style={textStyle}>Description</Text>
        <TextInput
          style={{ 
            color: textStyle.color as string, 
            borderRadius: 10, 
            padding: 5, 
            backgroundColor: 'rgba(184, 184, 184, 0.73)', 
            marginTop: 5 
          }}
          value={formData.description}
          multiline
          numberOfLines={4}
          onChangeText={(text) => handleInputChange('description', text)}
        />
      </View>
      <View style={{ 
        borderWidth: 1, 
        borderColor: textStyle.color as string, 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={textStyle}>Debt</Text>
          <TextInput
            style={{ 
              color: textStyle.color as string, 
              borderBottomWidth: 1, 
              marginTop: 5 
            }}
            value={formData.debt}
            onChangeText={(text) => handleInputChange('debt', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={textStyle}>Monthly Cost</Text>
          <TextInput
            style={{ 
              color: textStyle.color as string, 
              borderBottomWidth: 1, 
              marginTop: 5 
            }}
            value={formData.monthlyCost}
            onChangeText={(text) => handleInputChange('monthlyCost', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={{ 
        borderWidth: 1, 
        borderColor: textStyle.color as string, 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={textStyle}>Purchase Price</Text>
          <TextInput
            style={{ 
              color: textStyle.color as string, 
              borderBottomWidth: 1, 
              marginTop: 5 
            }}
            value={formData.purchasePrice}
            onChangeText={(text) => handleInputChange('purchasePrice', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={textStyle}>Current Value</Text>
          <TextInput
            style={{ 
              color: textStyle.color as string, 
              borderBottomWidth: 1, 
              marginTop: 5 
            }}
            value={formData.currentValue}
            onChangeText={(text) => handleInputChange('currentValue', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={{ 
        borderWidth: 1, 
        borderColor: textStyle.color as string, 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 15 
      }}>
        <Text style={textStyle}>Category</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: buttonOutlineColor,
            borderRadius: 10,
            padding: 8,
            marginTop: 5,
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={textStyle}>
            {formData.category || 'Choose Category'}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: textStyle.backgroundColor as string,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '50%',
          }}>
            <ScrollView>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(184, 184, 184, 0.3)',
                  }}
                  onPress={() => selectCategory(cat)}
                >
                  <Text style={textStyle}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: buttonOutlineColor,
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
    monthlyCost: '',
    category: '',
    purchasePrice: '',
    currentValue: '',
  });
  const [existingFiles, setExistingFiles] = useState<FileType[]>([]);
  const [newFiles, setNewFiles] = useState<FileType[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const asset = await fetchAssetData(uid, assetIdString) as AssetData;
        console.log('Fetched asset data:', asset);
        setFormData({
          name: asset.name || '',
          description: asset.description || '',
          debt: asset.debt !== undefined ? String(asset.debt) : '0',
          monthlyCost: asset.monthlyCost !== undefined ? String(asset.monthlyCost) : '0',
          category: asset.category || 'Other',
          purchasePrice: asset.purchasePrice !== undefined ? String(asset.purchasePrice) : '0',
          currentValue: asset.currentValue !== undefined ? String(asset.currentValue) : '0',
        });
        const filesArray = Object.entries(asset.files || {})
          .map(([id, file]) => ({
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

  const saveFormData = async () => {
    try {
      const updatedAssetData: Partial<AssetData> = {
        name: formData.name,
        description: formData.description,
        debt: formData.debt ? parseFloat(formData.debt) : undefined,
        monthlyCost: formData.monthlyCost ? parseFloat(formData.monthlyCost) : undefined,
        category: formData.category,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      };
      await updateAsset(uid, assetIdString, updatedAssetData);
    } catch (error) {
      console.error('Error saving form data:', error);
      throw new Error('Failed to save form data');
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
    if (formData.monthlyCost && !isValidNumber(formData.monthlyCost)) {
      Alert.alert('Invalid Input', 'Monthly Cost must be a valid number.');
      return;
    }
    if (formData.purchasePrice && !isValidNumber(formData.purchasePrice)) {
      Alert.alert('Invalid Input', 'Purchase Price must be a valid number.');
      return;
    }
    if (formData.currentValue && !isValidNumber(formData.currentValue)) {
      Alert.alert('Invalid Input', 'Current Value must be a valid number.');
      return;
    }
    if (!formData.category) {
      Alert.alert('Invalid Input', 'Please select a category.');
      return;
    }

    setIsLoading(true);
    try {
      await saveFormData();
      const validNewFiles = newFiles
        .filter(file => file.uri && file.name)
        .map(file => ({
          uri: file.uri!,
          name: file.name!,
          type: file.type || null,
        }));
      if (filesToDelete.length > 0 || validNewFiles.length > 0) {
        await updateAssetFiles(uid, assetIdString, filesToDelete, validNewFiles);
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
              buttonOutlineColor={buttonOutlineColor}
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