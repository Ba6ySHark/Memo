import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { homeStyles } from '../styles/HomeScreen.styles';
import {
  ScreenHeader,
  GradientButton,
  UserInfo,
  CustomAlert,
} from './components';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { alertConfig, showConfirm, showError } = useCustomAlert();

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

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={homeStyles.gradient}
    >
      <View style={homeStyles.container}>
        <View style={homeStyles.header}>
          <ScreenHeader
            title="Welcome!"
            subtitle={user?.displayName || user?.email}
            titleStyle={homeStyles.title}
            subtitleStyle={homeStyles.subtitle}
          />
        </View>

        <View style={homeStyles.content}>
          <Text style={homeStyles.message}>
            You have successfully signed in to your account.
          </Text>
          
          <UserInfo
            user={user}
            style={homeStyles.userInfo}
            labelStyle={homeStyles.infoLabel}
            valueStyle={homeStyles.infoValue}
          />
        </View>

        <GradientButton
          title="Sign Out"
          onPress={handleSignOut}
          style={homeStyles.signOutButton}
          textStyle={homeStyles.signOutText}
          gradientStyle={homeStyles.buttonGradient}
        />
      </View>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
} 