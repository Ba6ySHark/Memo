import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { BlurView } from 'expo-blur';

export default function SearchBar({ 
  placeholder = 'Search...',
  onSearch = () => {},
  style = {},
  inputStyle = {},
}) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
    }
  };

  return (
    <View style={style}>
      <BlurView intensity={20} style={{
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <TextInput
          style={[{
            flex: 1,
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'transparent',
          }, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={{
          marginLeft: 10,
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 15,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
            marginRight: 5,
          }}>
            🔍
          </Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
          }}>
            Search
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
} 