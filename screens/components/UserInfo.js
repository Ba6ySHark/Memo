import React from 'react';
import { View, Text } from 'react-native';

export default function UserInfo({ 
  user, 
  style = {}, 
  labelStyle = {}, 
  valueStyle = {} 
}) {
  return (
    <View style={style}>
      <Text style={labelStyle}>Email:</Text>
      <Text style={valueStyle}>{user?.email}</Text>
      
      {user?.displayName && (
        <>
          <Text style={labelStyle}>Name:</Text>
          <Text style={valueStyle}>{user.displayName}</Text>
        </>
      )}
      
      <Text style={labelStyle}>User ID:</Text>
      <Text style={valueStyle}>{user?.uid}</Text>
    </View>
  );
} 