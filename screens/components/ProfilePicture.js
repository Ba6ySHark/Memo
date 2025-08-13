import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { imageService } from '../../services/imageService';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePicture({ 
  user, 
  style = {}, 
  imageStyle = {}, 
  onImageChange = () => {},
  onDeleteConfirm = () => {}
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useAuth();

  // Load profile image from Firebase when component mounts or user changes
  useEffect(() => {
    if (authUser?.uid) {
      loadProfileImageFromFirebase();
    } else {
      setProfileImage(null);
    }
  }, [authUser?.uid]);

  const loadProfileImageFromFirebase = async () => {
    try {
      console.log('Loading profile image from Firebase for user:', authUser.uid);
      
      // Get user document from Firestore to check for profile image URL
      const { db } = await import('../../config/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      
      if (userDoc.exists() && userDoc.data().profileImageURL) {
        console.log('Profile image found:', userDoc.data().profileImageURL);
        setProfileImage(userDoc.data().profileImageURL);
        onImageChange(userDoc.data().profileImageURL);
      } else {
        console.log('No profile image found in Firebase');
        setProfileImage(null);
        onImageChange(null);
      }
    } catch (error) {
      console.error('Error loading profile image from Firebase:', error);
      setProfileImage(null);
      onImageChange(null);
    }
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      console.log('Starting profile image picker...');
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Profile permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
        return;
      }

      // Launch image picker
      console.log('Launching profile image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      console.log('Profile image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Profile image selected:', result.assets[0].uri);
        
        // Upload to Firebase
        const uploadResult = await imageService.uploadProfileImage(authUser.uid, result.assets[0].uri);
        console.log('Profile upload result:', uploadResult);
        
        if (uploadResult.success) {
          setProfileImage(uploadResult.imageURL);
          onImageChange(uploadResult.imageURL);
        } else {
          Alert.alert('Error', uploadResult.message);
        }
      } else {
        console.log('Profile image picker was canceled or no image selected');
      }
    } catch (error) {
      console.error('Profile image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfileImage = () => {
    onDeleteConfirm({
      title: 'Delete Profile Picture',
      message: 'Are you sure you want to delete your profile picture?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          setIsLoading(true);
          const result = await imageService.deleteProfileImage(authUser.uid);
          
          if (result.success) {
            setProfileImage(null);
            onImageChange(null);
          } else {
            Alert.alert('Error', result.message);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to delete profile image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <View style={style}>
      <TouchableOpacity onPress={pickImage} disabled={isLoading}>
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
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                textAlign: 'center',
              }}>
                Tap to{'\n'}upload{'\n'}photo
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      {/* Delete Button - Only show when profile image exists */}
      {profileImage && !isLoading && (
        <TouchableOpacity 
          onPress={deleteProfileImage}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            padding: 6,
            borderRadius: 15,
          }}
        >
          <Text style={{
            color: '#ff6b6b',
            fontSize: 14,
          }}>
            🗑️
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 