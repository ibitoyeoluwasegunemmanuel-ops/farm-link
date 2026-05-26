import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, PhoneInput } from '../../components/common';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid Nigerian phone number.');
      return;
    }

    setLoading(true);
    try {
      await authService.sendOTP(`+234${cleaned.replace(/^0/, '')}`);
      navigation.navigate('OTP', {
        phone: `+234${cleaned.replace(/^0/, '')}`,
        purpose: 'login',
      });
    } catch (err) {
      Alert.alert('Error', handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Dark header */}
      <LinearGradient
        colors={[Colors.splashBg, '#1A3524']}
        style={styles.header}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoLeaf}>
            <Ionicons name="leaf" size={22} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>
            Farm<Text style={styles.logoAccent}>Link</Text>
          </Text>
        </View>
        <Text style={styles.headerTitle}>Welcome back</Text>
        <Text style={styles.headerSubtitle}>Sign in to your account</Text>
      </LinearGradient>

      {/* Form card */}
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Phone Number</Text>
          <Text style={styles.sectionHint}>
            We'll send a 6-digit verification code to your phone
          </Text>

          <PhoneInput
            value={phone}
            onChangeText={setPhone}
            containerStyle={styles.phoneInput}
          />

          <Button
            label="Send Verification Code"
            onPress={handleSendOTP}
            loading={loading}
            size="lg"
            style={styles.ctaBtn}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>New to FarmLink? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[8],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  logoLeaf: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
  },
  logoAccent: { color: Colors.primaryLight },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    marginBottom: Spacing[1],
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.6)',
  },
  formScroll: { flex: 1 },
  formContent: {
    padding: Spacing[4],
    paddingTop: Spacing[6],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  sectionHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[5],
    lineHeight: 22,
  },
  phoneInput: { marginBottom: Spacing[5] },
  ctaBtn: { marginBottom: Spacing[5] },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  terms: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing[5],
    lineHeight: 18,
    paddingHorizontal: Spacing[4],
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: FontFamily.medium,
  },
});
