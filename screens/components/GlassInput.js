import React from 'react';
import { Text, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassInput({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style = {},
  labelStyle = {},
  inputStyle = {}
}) {
  return (
    <>
      <Text style={labelStyle}>{label}</Text>
      <BlurView intensity={20} style={style}>
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </BlurView>
    </>
  );
} 