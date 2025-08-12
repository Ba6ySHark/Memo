import React from 'react';
import { View, Text } from 'react-native';

export default function ScreenHeader({ 
  title, 
  subtitle, 
  style = {}, 
  titleStyle = {}, 
  subtitleStyle = {} 
}) {
  return (
    <View style={style}>
      <Text style={titleStyle}>{title}</Text>
      <Text style={subtitleStyle}>{subtitle}</Text>
    </View>
  );
} 