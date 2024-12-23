import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create bouncing animation for the dots
    const animateDot = (dot) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300, // Faster bounce
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300, // Faster return
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Trigger the animation for all dots with delays
    animateDot(dot1);
    setTimeout(() => animateDot(dot2), 100); // Reduced delay for faster transition
    setTimeout(() => animateDot(dot3), 200);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [{ translateY: dot1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [{ translateY: dot2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [{ translateY: dot3 }],
            },
          ]}
        />
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark theme background
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
    marginHorizontal: 5,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff', // White text for dark theme
    fontWeight: '500',
  },
});

export default LoadingScreen;