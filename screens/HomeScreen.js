import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from './components/CustomAlert';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { alertConfig, showConfirm, showSuccess, showError } = useCustomAlert();

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
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>
            {user?.displayName || user?.email}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.message}>
            You have successfully signed in to your account.
          </Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
            
            {user?.displayName && (
              <>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{user.displayName}</Text>
              </>
            )}
            
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user?.uid}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.buttonGradient}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  userInfo: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
  },
  signOutButton: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 