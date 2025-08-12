import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { signupStyles } from '../styles/SignupScreen.styles';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleSignup = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!');
    }, 2000);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={signupStyles.gradient}
    >
      {/* Background decorative elements */}
      <View style={signupStyles.circle1} />
      <View style={signupStyles.circle2} />
      <View style={signupStyles.circle3} />
      <View style={signupStyles.circle4} />
      
      <ScrollView 
        style={signupStyles.scrollView}
        contentContainerStyle={signupStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            signupStyles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header */}
          <Animated.View 
            style={[
              signupStyles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={signupStyles.title}>Create Account</Text>
            <Text style={signupStyles.subtitle}>Join us today</Text>
          </Animated.View>

          {/* Signup Form */}
          <View style={signupStyles.formContainer}>
            {/* Full Name Input */}
            <Animated.View 
              style={[
                signupStyles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.inputLabel}>Full Name</Text>
              <BlurView intensity={20} style={signupStyles.glassInput}>
                <TextInput
                  style={signupStyles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </BlurView>
            </Animated.View>

            {/* Email Input */}
            <Animated.View 
              style={[
                signupStyles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.inputLabel}>Email</Text>
              <BlurView intensity={20} style={signupStyles.glassInput}>
                <TextInput
                  style={signupStyles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </BlurView>
            </Animated.View>

            {/* Password Input */}
            <Animated.View 
              style={[
                signupStyles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.inputLabel}>Password</Text>
              <BlurView intensity={20} style={signupStyles.glassInput}>
                <TextInput
                  style={signupStyles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </BlurView>
            </Animated.View>

            {/* Confirm Password Input */}
            <Animated.View 
              style={[
                signupStyles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.inputLabel}>Confirm Password</Text>
              <BlurView intensity={20} style={signupStyles.glassInput}>
                <TextInput
                  style={signupStyles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </BlurView>
            </Animated.View>

            {/* Terms and Conditions */}
            <Animated.View 
              style={[
                signupStyles.termsContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={signupStyles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={signupStyles.termsLink}>Privacy Policy</Text>
              </Text>
            </Animated.View>

            {/* Signup Button */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <TouchableOpacity 
                style={[signupStyles.signupButton, isLoading && signupStyles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={signupStyles.buttonGradient}
                >
                  <Text style={signupStyles.signupButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <Animated.View 
              style={[
                signupStyles.loginContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={signupStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={signupStyles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
} 