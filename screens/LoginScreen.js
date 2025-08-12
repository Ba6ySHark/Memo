import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles } from '../styles/LoginScreen.styles';
import {
  GlassInput,
  GradientButton,
  AnimatedContainer,
  BackgroundCircles,
  ScreenHeader,
  NavigationLink,
} from './components';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Login successful!');
    }, 2000);
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
          <AnimatedContainer style={loginStyles.header}>
            <ScreenHeader
              title="Welcome Back"
              subtitle="Sign in to continue"
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
              <TouchableOpacity style={loginStyles.forgotPassword}>
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
            <AnimatedContainer style={loginStyles.signupContainer}>
              <NavigationLink
                text="Don't have an account?"
                linkText="Sign Up"
                onPress={() => navigation.navigate('Signup')}
                textStyle={loginStyles.signupText}
                linkStyle={loginStyles.signupLink}
              />
            </AnimatedContainer>
          </View>
        </AnimatedContainer>
      </ScrollView>
    </LinearGradient>
  );
} 