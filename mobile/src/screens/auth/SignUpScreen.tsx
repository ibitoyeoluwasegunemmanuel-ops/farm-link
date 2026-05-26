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
import { Button, PhoneInput, Input } from '../../components/common';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter your full name.');
      return;
    }
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid Nigerian phone number.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+234${cleaned.replace(/^0/, '')}`;
      await authService.sendOTP(fullPhone);
      navigation.navigate('OTP', { phone: fullPhone, purpose: 'signup' });
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
      {/* Header */}
      <LinearGradient colors={[Colors.splashBg, '#1A3524']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join over 50,000 farmers on FarmLink</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Input
            label="Full Name"
            placeholder="e.g. Emeka Okafor"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textSecondary} />}
          />

          <PhoneInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
          />

          <Button
            label="Continue"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={styles.ctaBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            { icon: 'shield-checkmark-outline', text: 'Secure & verified platform' },
            { icon: 'people-outline', text: 'Join 50,000+ farmers' },
            { icon: 'trending-up-outline', text: 'Grow your farm business' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon as any} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.terms}>
          By creating an account, you agree to our{' '}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
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
  scroll: { flex: 1 },
  content: { padding: Spacing[4], paddingTop: Spacing[6] },
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
  ctaBtn: { marginTop: Spacing[2] },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  loginText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  features: {
    marginTop: Spacing[6],
    gap: Spacing[3],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
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
  termsLink: { color: Colors.primary, fontFamily: FontFamily.medium },
});
