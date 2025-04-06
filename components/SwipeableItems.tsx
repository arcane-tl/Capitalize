import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { swipeMenuStyle } from '@/components/css/CustomStyles';

interface SwipeableItemProps<T> {
  item: T;
  renderItem: (item: T) => JSX.Element;
  onDelete: (item: T) => void;
  onModify: (item: T) => void;
  containerStyle?: object;
  deleteBackgroundColor: string;
  deleteTextColor: string;
  modifyBackgroundColor: string;
  modifyTextColor: string;
}

const SwipeableItem = <T,>({
  item,
  renderItem,
  onDelete,
  onModify,
  containerStyle,
  deleteBackgroundColor,
  deleteTextColor,
  modifyBackgroundColor,
  modifyTextColor,
}: SwipeableItemProps<T>) => {
  const translateX = useSharedValue(0);
  const THRESHOLD = 100; // Distance in pixels to trigger action

  // Pan gesture to handle swipes
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -THRESHOLD) { // Swiping left
        onDelete(item);
        translateX.value = withTiming(0);
      } else if (event.translationX > THRESHOLD) { // Swiping right
        onModify(item);
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
      }
    });

  // Animated style for the swipeable item
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Opacity for delete background (shown when swiping left)
  const deleteOpacity = useDerivedValue(() => {
    const swipeDistance = -translateX.value;
    if (swipeDistance > 0) {
      return swipeDistance >= THRESHOLD ? 1 : 0.5;
    }
    return 0;
  });

  // Opacity for modify background (shown when swiping right)
  const modifyOpacity = useDerivedValue(() => {
    const swipeDistance = translateX.value;
    if (swipeDistance > 0) {
      return swipeDistance >= THRESHOLD ? 1 : 0.5;
    }
    return 0;
  });

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
  }));

  const modifyStyle = useAnimatedStyle(() => ({
    opacity: modifyOpacity.value,
  }));

  return (
    <View style={swipeMenuStyle.swipeContainer}>
      {/* Delete background (revealed on left swipe) */}
      <Animated.View style={[swipeMenuStyle.deleteBackground, { backgroundColor: deleteBackgroundColor }, deleteStyle]}>
        <View style={swipeMenuStyle.actionContent}>
          <Ionicons name="trash-outline" size={20} color={deleteTextColor} />
        </View>
      </Animated.View>

      {/* Modify background (revealed on right swipe) */}
      <Animated.View style={[swipeMenuStyle.modifyBackground, { backgroundColor: modifyBackgroundColor }, modifyStyle]}>
        <View style={swipeMenuStyle.actionContent}>
          <Ionicons name="pencil-outline" size={20} color={modifyTextColor} />
        </View>
      </Animated.View>

      {/* Swipeable item */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[containerStyle, animatedStyle]}>
          {renderItem(item)}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SwipeableItem;