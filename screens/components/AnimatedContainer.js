import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function AnimatedContainer({ 
  children, 
  style = {}, 
  duration = 400,
  delay = 0,
  useNativeDriver = true 
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          useNativeDriver,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [duration, delay, useNativeDriver]);

  return (
    <Animated.View 
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
} 