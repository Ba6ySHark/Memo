import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { imageService } from '../../services/imageService';
import { useAuth } from '../../contexts/AuthContext';

export default function ImageFeed({ 
  style = {}, 
  containerStyle = {},
  onImagePublish = () => {},
  onSignOut = () => {},
  onDeleteConfirm = () => {},
  userId = null, // Allow passing a specific user ID
  readOnly = false // Disable editing for other users' profiles
}) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user: authUser } = useAuth();

  // Use provided userId or fall back to current user
  const targetUserId = userId || authUser?.uid;

  // Load user's feed on component mount
  useEffect(() => {
    if (targetUserId) {
      loadUserFeed();
    }
  }, [targetUserId]);

  const loadUserFeed = async () => {
    try {
      setIsLoading(true);
      const result = await imageService.getUserFeed(targetUserId);
      
      if (result.success) {
        setImages(result.feed);
      } else {
        console.error('Failed to load feed:', result.message);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickAndPublishImage = async () => {
    // Don't allow publishing in read-only mode
    if (readOnly) {
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting image picker...');
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to publish images.');
        return;
      }

      // Launch image picker
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      console.log('Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        
        // Upload to Firebase
        const uploadResult = await imageService.uploadFeedImage(authUser.uid, result.assets[0].uri);
        console.log('Upload result:', uploadResult);
        
        if (uploadResult.success) {
          // Add new image to the beginning of the feed
          const newImage = {
            id: uploadResult.postId,
            imageURL: uploadResult.imageURL,
            timestamp: new Date().toLocaleString(),
            storagePath: uploadResult.storagePath, // Use the actual storage path from Firebase
          };
          
          setImages(prevImages => [newImage, ...prevImages]);
          onImagePublish(newImage);
        } else {
          Alert.alert('Error', uploadResult.message);
        }
      } else {
        console.log('Image picker was canceled or no image selected');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = (imageId, storagePath) => {
    // Don't allow deleting in read-only mode
    if (readOnly) {
      return;
    }

    onDeleteConfirm({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          const result = await imageService.deleteFeedImage(imageId, storagePath);
          
          if (result.success) {
            setImages(prevImages => prevImages.filter(img => img.id !== imageId));
          } else {
            Alert.alert('Error', result.message);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to delete image. Please try again.');
        }
      },
    });
  };

  return (
    <View style={style}>
      {/* Buttons Container - Only show if not read-only */}
      {!readOnly && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          width: '100%',
        }}>
          {/* Publish Button */}
          <TouchableOpacity onPress={pickAndPublishImage} disabled={isUploading}>
            <BlurView intensity={20} style={{
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              paddingHorizontal: 30,
              paddingVertical: 15,
              opacity: isUploading ? 0.7 : 1,
            }}>
              {isUploading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  Publish Image
                </Text>
              )}
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
                fontSize: 14,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Sign Out
              </Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      )}

      {/* Images Feed */}
      <View>
        {isLoading ? (
          <View style={{
            alignItems: 'center',
            paddingVertical: 40,
          }}>
            <ActivityIndicator color="#ffffff" size="large" />
            <Text style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 16,
              marginTop: 10,
            }}>
              Loading feed...
            </Text>
          </View>
        ) : images.length === 0 ? (
          <View style={{
            alignItems: 'center',
            paddingVertical: 40,
          }}>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 16,
              textAlign: 'center',
            }}>
              {readOnly ? 'No images published yet.' : 'No images published yet.\nTap "Publish Image" to get started!'}
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
                  source={{ uri: image.imageURL }}
                  style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{
                  padding: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 12,
                  }}>
                    Published: {image.timestamp}
                  </Text>
                  {!readOnly && (
                    <TouchableOpacity 
                      onPress={() => deleteImage(image.id, image.storagePath)}
                      style={{
                        padding: 8,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{
                        color: '#ff6b6b',
                        fontSize: 16,
                      }}>
                        🗑️
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </BlurView>
            </View>
          ))
        )}
      </View>
    </View>
  );
} 