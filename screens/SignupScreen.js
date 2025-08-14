import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signupStyles } from '../styles/SignupScreen.styles';
import { useAuth } from '../contexts/AuthContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import {
  GlassInput,
  GradientButton,
  AnimatedContainer,
  BackgroundCircles,
  ScreenHeader,
  NavigationLink,
  CustomAlert,
} from './components';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { alertConfig, showError, showSuccess } = useCustomAlert();

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showError('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      showError('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showError('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password, fullName);
      
      if (result.success) {
        // Navigation to HomeScreen will be handled by the auth state change
        // No success alert needed - user will be redirected automatically
      } else {
        showError('Error', result.message);
      }
    } catch (error) {
      showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={signupStyles.gradient}
    >
      {/* Background decorative elements */}
      <BackgroundCircles
        circle1Style={signupStyles.circle1}
        circle2Style={signupStyles.circle2}
        circle3Style={signupStyles.circle3}
        circle4Style={signupStyles.circle4}
      />
      
      <ScrollView 
        style={signupStyles.scrollView}
        contentContainerStyle={signupStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedContainer style={signupStyles.content}>
          {/* Header */}
          <AnimatedContainer>
            <ScreenHeader
              title="Create Account"
              subtitle="Join us today"
              style={signupStyles.header}
              titleStyle={signupStyles.title}
              subtitleStyle={signupStyles.subtitle}
            />
          </AnimatedContainer>

          {/* Signup Form */}
          <View style={signupStyles.formContainer}>
            {/* Full Name Input */}
            <AnimatedContainer style={signupStyles.inputContainer}>
              <GlassInput
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                labelStyle={signupStyles.inputLabel}
                style={signupStyles.glassInput}
                inputStyle={signupStyles.input}
              />
            </AnimatedContainer>

            {/* Email Input */}
            <AnimatedContainer style={signupStyles.inputContainer}>
              <GlassInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                labelStyle={signupStyles.inputLabel}
                style={signupStyles.glassInput}
                inputStyle={signupStyles.input}
              />
            </AnimatedContainer>

            {/* Password Input */}
            <AnimatedContainer style={signupStyles.inputContainer}>
              <GlassInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                labelStyle={signupStyles.inputLabel}
                style={signupStyles.glassInput}
                inputStyle={signupStyles.input}
              />
              <Text style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 12,
                marginTop: 5,
                marginLeft: 15,
              }}>
                Password must be at least 8 characters long
              </Text>
            </AnimatedContainer>

            {/* Confirm Password Input */}
            <AnimatedContainer style={signupStyles.inputContainer}>
              <GlassInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                labelStyle={signupStyles.inputLabel}
                style={signupStyles.glassInput}
                inputStyle={signupStyles.input}
              />
            </AnimatedContainer>

            {/* Terms and Conditions */}
            <AnimatedContainer style={signupStyles.termsContainer}>
              <Text style={signupStyles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={signupStyles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={signupStyles.termsLink}>Privacy Policy</Text>
              </Text>
            </AnimatedContainer>

            {/* Signup Button */}
            <AnimatedContainer>
              <GradientButton
                title={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleSignup}
                disabled={isLoading}
                style={signupStyles.signupButton}
                textStyle={signupStyles.signupButtonText}
                gradientStyle={signupStyles.buttonGradient}
              />
            </AnimatedContainer>

            {/* Login Link */}
            <AnimatedContainer>
              <NavigationLink
                text="Already have an account?"
                linkText="Sign In"
                onPress={() => navigation.navigate('Login')}
                style={signupStyles.loginContainer}
                textStyle={signupStyles.loginText}
                linkStyle={signupStyles.loginLink}
              />
            </AnimatedContainer>
          </View>
        </AnimatedContainer>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert {...alertConfig} />
    </LinearGradient>
  );
} 