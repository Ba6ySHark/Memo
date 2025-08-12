import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NavigationLink({ 
  text, 
  linkText, 
  onPress, 
  style = {}, 
  textStyle = {}, 
  linkStyle = {} 
}) {
  return (
    <View style={style}>
      <Text style={textStyle}>{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={linkStyle}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
} 