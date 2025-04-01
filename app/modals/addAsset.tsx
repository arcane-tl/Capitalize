import React, { useState } from 'react';
import { View, Text, TextStyle, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors, globalStyles } from '../../components/css/styles';
import { assetModalStyles } from '../../components/css/customStyles';
import { getStyle } from '@/components/themeUtils';

export default function AddAssetModal({ closeModal }: { closeModal: () => void }) {
  const [assetName, setAssetName] = useState<string>('');
  const [assetDescription, setDescription] = useState<string>('');
  const [assetPurchasePrice, setAssetPurchasePrice] = useState<string>('');

  function saveAsset(): void {
    Alert.alert('Asset Saved', 'FUNCTION MISSING! Your asset has been successfully saved.', [
      {
        text: 'OK',
        onPress: () => closeModal(),
      },
    ]);
  }

  return (
    <View style={assetModalStyles.mainContainer}>
      <View style={[assetModalStyles.contentContainer, { backgroundColor: getStyle('Background', colors) }]}>
        {/* Add your modal content here */}
        {/* Header Container */}
        <View style={assetModalStyles.headerContainer}>
          <View style={assetModalStyles.headerLeft}>
            <TouchableOpacity onPress={closeModal} style={[assetModalStyles.cancelButton, {borderColor: getStyle('ButtonOutline', colors)}]}>
              <Text 
                style={[
                  getStyle('Text', globalStyles) as TextStyle,
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={assetModalStyles.headerCenter}>
            <Text
              style={[
                assetModalStyles.modalTitleText,
                getStyle('Text', globalStyles) as TextStyle,
              ]}
            >
              New Asset
            </Text>
          </View>
          <View style={assetModalStyles.headerRight}>
            <TouchableOpacity onPress={saveAsset} style={assetModalStyles.addButton}>
              <Text 
                style={[
                  getStyle('Text', globalStyles) as TextStyle,
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={assetModalStyles.innerContentContainer}>
          <TextInput
            style={[
              globalStyles.input as TextStyle,
              getStyle('Input', globalStyles) as TextStyle,
              { width: '90%',
                height: 50,
                borderRadius: 10 },
            ]}
            placeholder="Name"
            placeholderTextColor={ getStyle('PlaceholderText', colors) }
            value={ assetName }
            onChangeText={ setAssetName }
            keyboardType="default"
            autoCapitalize="none"
            editable={ true }
          />
          <TextInput
            style={[
              globalStyles.input as TextStyle,
              getStyle('Input', globalStyles) as TextStyle,
              { width: '90%',
                height: 150,
                borderRadius: 10,
                textAlignVertical: 'top' },
            ]}
            placeholder="Description"
            placeholderTextColor={ getStyle('PlaceholderText', colors) }
            value={ assetDescription }
            onChangeText={ setDescription }
            keyboardType="default"
            autoCapitalize="none"
            editable={ true }
            multiline={ true }
            maxLength={ 160 }
          />
          <TextInput
            style={[
              globalStyles.input as TextStyle,
              getStyle('Input', globalStyles) as TextStyle,
              { width: '90%',
                height: 50,
                borderRadius: 10 },
            ]}
            placeholder="Purchase Price"
            placeholderTextColor={ getStyle('PlaceholderText', colors) }
            value={ assetPurchasePrice }
            onChangeText={ setAssetPurchasePrice }
            keyboardType="decimal-pad"
            autoCapitalize="none"
            editable={ true }
          />
        </View>
      </View>
    </View>
  );
}