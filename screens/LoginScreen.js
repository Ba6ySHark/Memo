import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles } from '../styles/LoginScreen.styles';
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const { alertConfig, showError, showSuccess, showConfirm } = useCustomAlert();

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Navigation to HomeScreen will be handled by the auth state change
        // No success alert needed - user will be redirected automatically
      } else {
        console.log('Login failed:', result); // Debug log
        showError('Error', result.message);
      }
    } catch (error) {
      console.log('Login error:', error); // Debug log
      showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      showError('Error', 'Please enter your email address first');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Error', 'Please enter a valid email address');
      return;
    }
    
    showConfirm({
      title: 'Reset Password',
      message: `Send password reset email to ${email}?`,
      confirmText: 'Send',
      onConfirm: async () => {
        try {
          const result = await resetPassword(email);
          if (result.success) {
            // Password reset email sent successfully - no need for success alert
            // User will receive the email
          } else {
            showError('Error', result.message);
          }
        } catch (error) {
          showError('Error', 'Failed to send reset email. Please try again.');
        }
      },
    });
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={loginStyles.gradient}
    >
      {/* Background decorative elements */}
      <BackgroundCircles
        circle1Style={loginStyles.circle1}
        circle2Style={loginStyles.circle2}
        circle3Style={loginStyles.circle3}
      />
      
      <ScrollView 
        style={loginStyles.scrollView}
        contentContainerStyle={loginStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedContainer style={loginStyles.content}>
          {/* Header */}
          <AnimatedContainer>
            <ScreenHeader
              title="Welcome Back"
              subtitle="Sign in to continue"
              style={loginStyles.header}
              titleStyle={loginStyles.title}
              subtitleStyle={loginStyles.subtitle}
            />
          </AnimatedContainer>

          {/* Login Form */}
          <View style={loginStyles.formContainer}>
            {/* Email Input */}
            <AnimatedContainer style={loginStyles.inputContainer}>
              <GlassInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                labelStyle={loginStyles.inputLabel}
                style={loginStyles.glassInput}
                inputStyle={loginStyles.input}
              />
            </AnimatedContainer>

            {/* Password Input */}
            <AnimatedContainer style={loginStyles.inputContainer}>
              <GlassInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                labelStyle={loginStyles.inputLabel}
                style={loginStyles.glassInput}
                inputStyle={loginStyles.input}
              />
            </AnimatedContainer>

            {/* Forgot Password */}
            <AnimatedContainer>
              <TouchableOpacity style={loginStyles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </AnimatedContainer>

            {/* Login Button */}
            <AnimatedContainer>
              <GradientButton
                title={isLoading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
                disabled={isLoading}
                style={loginStyles.loginButton}
                textStyle={loginStyles.loginButtonText}
                gradientStyle={loginStyles.buttonGradient}
              />
            </AnimatedContainer>

            {/* Sign Up Link */}
            <AnimatedContainer>
              <NavigationLink
                text="Don't have an account?"
                linkText="Sign Up"
                onPress={() => navigation.navigate('Signup')}
                style={loginStyles.signupContainer}
                textStyle={loginStyles.signupText}
                linkStyle={loginStyles.signupLink}
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