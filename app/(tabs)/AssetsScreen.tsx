import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import { ref, get } from 'firebase/database';
import { database } from '@/components/database/FirebaseConfig';
import { useUserStore } from '@/constants/userStore';
import { useThemeStyles } from '@/components/ThemeUtils';
import SwipeableItem from '@/components/SwipeableItems';
import { assetListStyle } from '@/components/css/CustomStyles';
import { useAssetStore } from '@/app/modals/AddAsset';
import { deleteItem } from '@/components/FirebaseAPI';

interface Asset {
  id: string;
  name: string;
  description: string;
  purchasePrice: string;
  assetPictureUri: string | null;
  assetPictureLocal: any;
}

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userUID = useUserStore((state) => state.user?.uid);
  const refreshAssets = useAssetStore((state) => state.refreshAssets);

  // Extract theme styles
  const {
    backgroundColor,
    listItemBackgroundColor,
    secondaryTextColor,
    deleteBackgroundColor,
    deleteTextColor,
    modifyBackgroundColor,
    modifyTextColor,
    borderColor,
    assetNameTextColor,
  } = useThemeStyles();

  // Fetch assets from Firebase when userUID changes
  useEffect(() => {
    if (!userUID) {
      console.log('No user UID found, skipping fetch.');
      setLoading(false);
      return;
    }

    const fetchAssets = async () => {
      try {
        const assetsRef = ref(database, `users/${userUID}/assets`);
        const snapshot = await get(assetsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const assetsArray = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name || 'Unknown',
            description: data[key].description || '',
            purchasePrice: data[key].purchasePrice ? String(data[key].purchasePrice) : '0',
            assetPictureUri: data[key].assetPictureLink || null,
            assetPictureLocal: data[key].assetPictureLink ? null : require('../../assets/nofileIcon.png'),
          }));
          setAssets(assetsArray);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [userUID, refreshAssets]);

  // Handler for deleting an asset
  const deleteAsset = (item: Asset) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this asset? This will permanently delete the asset and its associated file.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting asset:', item.id, 'User UID:', userUID);
              // Call the modular deleteItem function
              await deleteItem(userUID!, 'asset', item.id);
              // Update the local state to remove the deleted asset
              setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== item.id));
            } catch (error) {
              console.error('Error deleting asset:', error);
              Alert.alert('Error', 'Failed to delete asset. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Handler for modifying an asset (placeholder)
  const modifyAsset = (item: Asset) => {
    console.log('Modify asset:', item.id);
    // TODO: Implement modify logic (e.g., open a modal or navigate to an edit screen)
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={[assetListStyle.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render the assets list with swipeable items
  return (
    <View style={[assetListStyle.screenContainer, { backgroundColor }]}>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableItem
            item={item}
            renderItem={(asset) => (
              <View style={assetListStyle.itemContent}>
                <Image
                  source={asset.assetPictureUri ? { uri: asset.assetPictureUri } : asset.assetPictureLocal}
                  style={assetListStyle.assetImage}
                />
                <View style={assetListStyle.detailsContainer}>
                  <Text style={[assetListStyle.assetName, { color: assetNameTextColor }]}>
                    {asset.name}, {asset.purchasePrice}€
                  </Text>
                  <Text style={[assetListStyle.assetDescription, { color: secondaryTextColor }]}>
                    {asset.description}
                  </Text>
                </View>
              </View>
            )}
            onDelete={deleteAsset}
            onModify={modifyAsset}
            containerStyle={{
              backgroundColor: listItemBackgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
              padding: 5,
              marginBottom: 10,
              borderRadius: 10,
            }}
            deleteBackgroundColor={deleteBackgroundColor}
            deleteTextColor={deleteTextColor}
            modifyBackgroundColor={modifyBackgroundColor}
            modifyTextColor={modifyTextColor}
          />
        )}
      />
    </View>
  );
}