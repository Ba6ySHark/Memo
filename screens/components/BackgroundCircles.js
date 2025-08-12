import React from 'react';
import { View } from 'react-native';

export default function BackgroundCircles({ 
  circle1Style = {}, 
  circle2Style = {}, 
  circle3Style = {}, 
  circle4Style = null 
}) {
  return (
    <>
      <View style={circle1Style} />
      <View style={circle2Style} />
      <View style={circle3Style} />
      {circle4Style && <View style={circle4Style} />}
    </>
  );
} 