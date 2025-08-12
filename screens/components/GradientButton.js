import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton({ 
  title, 
  onPress, 
  disabled = false, 
  colors = ['#667eea', '#764ba2'],
  style = {},
  textStyle = {},
  gradientStyle = {}
}) {
  return (
    <TouchableOpacity 
      style={[style, disabled && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={colors}
        style={gradientStyle}
      >
        <Text style={textStyle}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
} 