import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePicture({ 
  user, 
  style = {}, 
  imageStyle = {}, 
  onImageChange = () => {} 
}) {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={style}>
      {profileImage ? (
        <Image
          source={{ uri: profileImage }}
          style={[{
            width: '100%',
            height: '100%',
            borderRadius: 50,
          }, imageStyle]}
        />
      ) : (
        <View style={[{
          width: '100%',
          height: '100%',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }, imageStyle]}>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            textAlign: 'center',
          }}>
            Tap to{'\n'}upload{'\n'}photo
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 