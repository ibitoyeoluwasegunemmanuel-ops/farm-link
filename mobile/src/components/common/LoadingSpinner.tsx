import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 36,
  color = Colors.primary,
  style,
  fullScreen = false,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinner = (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size * 0.1,
          borderColor: `${color}30`,
          borderTopColor: color,
          transform: [{ rotate }],
        },
        style,
      ]}
    />
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{spinner}</View>;
  }

  return spinner;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
