import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { homeStyles } from '../styles/HomeScreen.styles';
import {
  ScreenHeader,
  GradientButton,
  UserInfo,
  CustomAlert,
  ProfilePicture,
  SearchBar,
  ImageFeed,
} from './components';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { alertConfig, showConfirm, showError } = useCustomAlert();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    showConfirm({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        const result = await signOut();
        if (result.success) {
          // User will be automatically redirected to login screen
          // No success alert needed
        } else {
          showError('Error', result.message);
        }
      },
    });
  };

  const handleSearch = (searchTerm) => {
    // Handle search functionality
    console.log('Searching for:', searchTerm);
  };

  const handleImagePublish = (image) => {
    // Handle image publish
    console.log('Image published:', image);
  };

  const handleProfileImageChange = (imageUri) => {
    // Handle profile image change
    console.log('Profile image changed:', imageUri);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={homeStyles.gradient}
    >
      <View style={[homeStyles.container, { paddingTop: insets.top + 20 }]}>
        {/* Search Bar */}
        <View style={homeStyles.searchContainer}>
          <SearchBar
            placeholder="Search users..."
            onSearch={handleSearch}
          />
        </View>

        {/* Profile Section */}
        <View style={homeStyles.profileSection}>
          <ProfilePicture
            user={user}
            style={homeStyles.profilePicture}
            imageStyle={homeStyles.profilePicture}
            onImageChange={handleProfileImageChange}
          />
          
          <View style={homeStyles.profileInfo}>
            <UserInfo
              user={user}
              style={homeStyles.userInfo}
              labelStyle={homeStyles.infoLabel}
              valueStyle={homeStyles.infoValue}
            />
          </View>
        </View>

        {/* Image Feed with Buttons */}
        <View style={homeStyles.feedContainer}>
          <ImageFeed
            onImagePublish={handleImagePublish}
            onSignOut={handleSignOut}
          />
        </View>
      </View>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
} 