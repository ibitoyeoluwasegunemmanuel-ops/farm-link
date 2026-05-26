import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Screens (imported lazily to keep navigator file clean)
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import CreateProfileScreen from '../screens/auth/CreateProfileScreen';
import KYCScreen from '../screens/auth/KYCScreen';
import AccountCreatedScreen from '../screens/auth/AccountCreatedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="OTP" component={OTPScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="KYC" component={KYCScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} options={{ animation: 'fade' }} />
  </Stack.Navigator>
);
