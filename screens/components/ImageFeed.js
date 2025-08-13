import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

export default function ImageFeed({ 
  style = {}, 
  containerStyle = {},
  onImagePublish = () => {},
  onSignOut = () => {}
}) {
  const [images, setImages] = useState([]);

  const pickAndPublishImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to publish images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          timestamp: new Date().toLocaleString(),
        };
        
        setImages(prevImages => [newImage, ...prevImages]);
        onImagePublish(newImage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <View style={style}>
      {/* Buttons Container */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
      }}>
        {/* Publish Button */}
        <TouchableOpacity onPress={pickAndPublishImage}>
          <BlurView intensity={20} style={{
            borderRadius: 15,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            paddingHorizontal: 30,
            paddingVertical: 15,
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              📷 Publish Image
            </Text>
          </BlurView>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity onPress={onSignOut}>
          <BlurView intensity={20} style={{
            borderRadius: 15,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            paddingHorizontal: 30,
            paddingVertical: 15,
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              🚪 Sign Out
            </Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Images Feed */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {images.length === 0 ? (
          <View style={{
            alignItems: 'center',
            paddingVertical: 40,
          }}>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 16,
              textAlign: 'center',
            }}>
              No images published yet.{'\n'}Tap "Publish Image" to get started!
            </Text>
          </View>
        ) : (
          images.map((image) => (
            <View key={image.id} style={[{
              marginBottom: 20,
              borderRadius: 15,
              overflow: 'hidden',
            }, containerStyle]}>
              <BlurView intensity={20} style={{
                borderRadius: 15,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
              }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{
                  padding: 15,
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 12,
                  }}>
                    Published: {image.timestamp}
                  </Text>
                </View>
              </BlurView>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
} 