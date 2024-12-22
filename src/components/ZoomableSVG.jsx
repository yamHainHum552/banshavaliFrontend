import React from "react";
import { View } from "react-native";
import Svg from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ZoomableSvg = ({ children }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panOffsetX = useSharedValue(0);
  const panOffsetY = useSharedValue(0);

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = Math.max(1, Math.min(5, event.scale));
  });

  // Pan Gesture (Translation)
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = panOffsetX.value + event.translationX;
      translateY.value = panOffsetY.value + event.translationY;
    })
    .onEnd(() => {
      panOffsetX.value = translateX.value;
      panOffsetY.value = translateY.value;
    });

  // Combine Pinch and Pan Gestures
  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated Style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(scale.value) },
      { translateX: withTiming(translateX.value) },
      { translateY: withTiming(translateY.value) },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Svg height="100%" width="100%">
          {children}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableSvg;
