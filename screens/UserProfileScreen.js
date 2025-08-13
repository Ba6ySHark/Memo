import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { imageService } from '../services/imageService';
import {
  ScreenHeader,
  CustomAlert,
  ProfilePicture,
  ImageFeed,
} from './components';
import ScrollableBackgroundCircles from './components/ScrollableBackgroundCircles';

export default function UserProfileScreen({ route, navigation }) {
  const { user: currentUser } = useAuth();
  const { alertConfig, showError } = useCustomAlert();
  const insets = useSafeAreaInsets();
  const [scrollY, setScrollY] = useState(0);
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from navigation params
  const { userId, displayName, email, profileImageURL } = route.params;

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Get user data from Firestore
      const result = await imageService.getUserProfile(userId);
      
      if (result.success) {
        setProfileUser(result.user);
      } else {
        showError('Error', 'Failed to load user profile');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showError('Error', 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  const handleImagePublish = (image) => {
    // This shouldn't be called for other users' profiles
    console.log('Image published:', image);
  };

  const handleProfileImageChange = (imageUri) => {
    // This shouldn't be called for other users' profiles
    console.log('Profile image changed:', imageUri);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: '#ffffff', fontSize: 16 }}>Loading profile...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={{ flex: 1 }}
    >
      {/* Background Circles */}
      <ScrollableBackgroundCircles scrollY={scrollY} />
      
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top + 20, 
        paddingHorizontal: 20, 
        paddingBottom: 20,
        zIndex: 1 
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity 
            onPress={handleGoBack}
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          
          <Text style={{
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
          }}>
            {displayName}'s Profile
          </Text>
          
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Section */}
        <View style={{
          alignItems: 'center',
          paddingHorizontal: 20,
          marginBottom: 30,
        }}>
          <ProfilePicture
            user={profileUser || { displayName, email, profileImageURL }}
            style={{
              width: 120,
              height: 120,
              marginBottom: 20,
            }}
            imageStyle={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
            onImageChange={handleProfileImageChange}
            onDeleteConfirm={() => {}}
            readOnly={true} // Make it read-only for other users
          />
          
          <Text style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 8,
          }}>
            {displayName}
          </Text>
          
          <Text style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 16,
            marginBottom: 20,
          }}>
            {email}
          </Text>
        </View>

        {/* User's Feed */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 15,
          }}>
            {displayName}'s Posts
          </Text>
          
          <ImageFeed
            userId={userId} // Pass the specific user ID
            onImagePublish={handleImagePublish}
            onSignOut={() => {}}
            onDeleteConfirm={() => {}}
            readOnly={true} // Make it read-only for other users
          />
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
} 