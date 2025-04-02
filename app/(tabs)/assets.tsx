import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, get } from 'firebase/database';
import { database } from '../../components/database/firebaseConfig';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useUserStore } from '../../constants/userStore';
import { useThemeStyles } from '@/components/themeUtils';

interface Asset {
  id: string;
  name: string;
  description: string;
  purchasePrice: string;
  assetPictureLink: string;
}

interface SwipeableItemProps {
  item: Asset;
  listItemBackground: string;
  deleteBackgroundColor: string;
  deleteTextColor: string;
  assetNameTextColor: string; // New prop for asset name text color
  secondaryTextColor: string;
  borderColor: string;
}

const SwipeableItem = ({
  item,
  listItemBackground,
  deleteBackgroundColor,
  deleteTextColor,
  assetNameTextColor,
  secondaryTextColor,
  borderColor,
}: SwipeableItemProps) => {
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -100;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, Math.max(SWIPE_THRESHOLD, event.translationX));
    })
    .onEnd((event) => {
      if (translateX.value <= SWIPE_THRESHOLD) {
        translateX.value = withTiming(-300);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? withTiming(1) : withTiming(0),
  }));

  return (
    <View style={styles.swipeContainer}>
      <Animated.View style={[styles.deleteBackground, { backgroundColor: deleteBackgroundColor }, deleteStyle]}>
        <Text style={[styles.deleteText, { color: deleteTextColor }]}>Delete</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.listContainer, { backgroundColor: listItemBackground, borderColor }, animatedStyle]}>
          <View style={[styles.imageContainer, { backgroundColor: listItemBackground }]}>
            <Image
              source={{ uri: item.assetPictureLink }}
              style={styles.assetImage}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.detailsContainer, { backgroundColor: listItemBackground }]}>
            <Text style={[styles.assetName, { color: assetNameTextColor }]}>
              {item.name}, {item.purchasePrice}€
            </Text>
            <Text style={[styles.assetDescription, { color: secondaryTextColor }]}>
              {item.description}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userUID = useUserStore((state) => state.user?.uid);

  const {
    backgroundColor,
    listItemBackground,
    secondaryTextColor,
    deleteBackgroundColor,
    deleteTextColor,
    borderColor,
    assetNameTextColor, // New theme property for asset name text color
  } = useThemeStyles();

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
            assetPictureLink: data[key].assetPictureLink || require('../../assets/nofileIcon.png'),
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
  }, [userUID]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor }]}>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableItem
            item={item}
            listItemBackground={listItemBackground}
            deleteBackgroundColor={deleteBackgroundColor}
            deleteTextColor={deleteTextColor}
            assetNameTextColor={assetNameTextColor}
            secondaryTextColor={secondaryTextColor}
            borderColor={borderColor}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  deleteText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 15,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
    borderRadius: 20,
  },
  assetImage: {
    width: 85,
    height: 85,
    borderRadius: 20,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetDescription: {
    fontSize: 14,
  },
});