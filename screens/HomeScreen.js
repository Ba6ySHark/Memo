import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { homeStyles } from '../styles/HomeScreen.styles';
import { imageService } from '../services/imageService';
import { searchService } from '../services/searchService';
import {
  ScreenHeader,
  GradientButton,
  UserInfo,
  CustomAlert,
  ProfilePicture,
  SearchBar,
  ImageFeed,
} from './components';
import ScrollableBackgroundCircles from './components/ScrollableBackgroundCircles';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { alertConfig, showConfirm, showError } = useCustomAlert();
  const insets = useSafeAreaInsets();
  const [scrollY, setScrollY] = useState(0);

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

  const testFirebaseConnection = async () => {
    console.log('Testing Firebase connection...');
    const result = await imageService.testFirebaseConnection();
    if (result.success) {
      console.log('Firebase connection test successful');
    } else {
      console.error('Firebase connection test failed:', result.error);
    }
  };

  const syncUserToFirestore = async () => {
    console.log('Syncing user to Firestore...');
    const result = await searchService.syncCurrentUserToFirestore();
    if (result.success) {
      console.log('User synced to Firestore successfully');
    } else {
      console.error('Failed to sync user to Firestore:', result.error);
    }
  };

  const syncAllUsersToFirestore = async () => {
    console.log('Syncing all users to Firestore...');
    const result = await searchService.syncAllUsersToFirestore();
    if (result.success) {
      console.log('All users synced to Firestore successfully');
    } else {
      console.error('Failed to sync all users to Firestore:', result.error);
    }
  };

  // Sync user to Firestore when component mounts
  useEffect(() => {
    if (user?.uid) {
      syncUserToFirestore();
    }
  }, [user]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={homeStyles.gradient}
    >
      {/* Background Circles */}
      <ScrollableBackgroundCircles scrollY={scrollY} />
      
      {/* Fixed Search Bar */}
      <View style={[homeStyles.searchContainer, { paddingTop: insets.top + 20, zIndex: 1 }]}>
        <SearchBar
          placeholder="Search users..."
          onSearch={handleSearch}
          navigation={navigation}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={[homeStyles.scrollView, { zIndex: 1 }]}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Section */}
        <View style={homeStyles.profileSection}>
          <ProfilePicture
            user={user}
            style={homeStyles.profilePicture}
            imageStyle={homeStyles.profilePicture}
            onImageChange={handleProfileImageChange}
            onDeleteConfirm={showConfirm}
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
            onDeleteConfirm={showConfirm}
          />
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
} 