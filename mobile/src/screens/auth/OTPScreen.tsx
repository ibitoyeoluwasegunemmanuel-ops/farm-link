import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, OTPInput } from '../../components/common';
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const RESEND_COOLDOWN = 60;

export default function OTPScreen({ navigation, route }: Props) {
  const { phone, purpose } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      Alert.alert('Incomplete', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.verifyOTP(phone, otp);
      const { token, userId, isNewUser } = res.data;

      if (isNewUser || purpose === 'signup') {
        navigation.replace('RoleSelection', { userId });
      } else {
        // Existing user — fetch profile then set
        const profileRes = await authService.getProfile();
        await setUser(profileRes.data.user, token);
        // RootNavigator will redirect to Main automatically
      }
    } catch (err) {
      Alert.alert('Invalid Code', handleApiError(err));
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authService.sendOTP(phone);
      startCountdown();
    } catch (err) {
      Alert.alert('Error', handleApiError(err));
    }
  };

  const maskedPhone = phone.replace(/(\+234)(\d{3})(\d{3})(\d{4})/, '$1 $2 *** $4');

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
        <View style={styles.headerIcon}>
          <Ionicons name="chatbubble-ellipses" size={28} color={Colors.white} />
        </View>
        <Text style={styles.headerTitle}>Verify Phone</Text>
        <Text style={styles.headerSubtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phoneText}>{maskedPhone}</Text>
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.card}>
          <OTPInput length={6} value={otp} onChange={setOtp} />

          <Button
            label="Verify"
            onPress={handleVerify}
            loading={loading}
            size="lg"
            style={styles.verifyBtn}
          />

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={!canResend}>
              <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                {canResend ? 'Resend' : `Resend in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wrong number */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.wrongNumBtn}>
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.wrongNumText}>Wrong number?</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: Spacing[5],
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
    marginBottom: Spacing[2],
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
  },
  phoneText: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primaryLight,
  },
  body: { flex: 1, padding: Spacing[4], paddingTop: Spacing[6] },
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
  verifyBtn: { marginTop: Spacing[6] },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  resendText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  resendLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  resendDisabled: { color: Colors.textTertiary },
  wrongNumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing[3],
    paddingVertical: Spacing[2],
  },
  wrongNumText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});
