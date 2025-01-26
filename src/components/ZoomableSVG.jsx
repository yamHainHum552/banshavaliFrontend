import React from "react";
import Svg from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
const ZoomableSvg = ({ children, scale }) => {
  const translateX = useSharedValue(0); // Horizontal pan
  const translateY = useSharedValue(0);
  // const panOffsetX = useSharedValue(0);
  // const panOffsetY = useSharedValue(0);

  // Gesture: Pinch for zoom
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    const zoomDelta = event.scale - 1;
    const newScale = scale.value + zoomDelta * 0.2;
    scale.value = Math.max(0.1, Math.min(5, newScale)); // Clamp between 1 and 5
  });

  // // Gesture: Pan for dragging
  // const panGesture = Gesture.Pan()
  //   .onUpdate((event) => {
  //     translateX.value = panOffsetX.value + event.translationX;
  //     translateY.value = panOffsetY.value + event.translationY;
  //   })
  //   .onEnd(() => {
  //     panOffsetX.value = translateX.value;
  //     panOffsetY.value = translateY.value;
  //   });

  // const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);
  const composedGesture = Gesture.Simultaneous(pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { damping: 10, stiffness: 100 }) },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[{ flex: 1, overflow: "hidden" }, animatedStyle]}>
        <Svg height="100%" width="100%">
          {children}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableSvg;
