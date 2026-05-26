import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, UserRole } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

type Props = NativeStackScreenProps<AuthStackParamList, 'AccountCreated'>;

const ROLE_PERKS: Record<UserRole, string[]> = {
  farmer: ['List your produce to 50,000+ buyers', 'AI crop disease detection', 'Free logistics booking'],
  buyer: ['Direct farm purchases', 'Escrow payment protection', 'Real-time delivery tracking'],
  transporter: ['Instant job notifications', 'Guaranteed payment on delivery', 'Navigation assistance'],
  equipment_owner: ['Rental income from equipment', 'Farmer matchmaking', 'Maintenance scheduling'],
  investor: ['Portfolio dashboard', 'Farm ROI analytics', 'Verified farmer network'],
};

export default function AccountCreatedScreen({ route }: Props) {
  const { role } = route.params;
  const setUser = useAuthStore((s) => s.setUser);

  const checkScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = async () => {
    try {
      const profileRes = await authService.getProfile();
      // Token is fetched from storage (set during OTP verify)
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const token = await AsyncStorage.getItem('@farmlink_token');
      if (profileRes.data.user && token) {
        await setUser(profileRes.data.user, token);
      }
    } catch {
      // If profile fetch fails (e.g., no network), still proceed — token already in storage
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const [userStr, token] = await AsyncStorage.multiGet(['@farmlink_user', '@farmlink_token']);
      // RootNavigator will redirect once authStore is hydrated on next launch
    }
  };

  const roleLabel: Record<UserRole, string> = {
    farmer: 'Farmer',
    buyer: 'Buyer',
    transporter: 'Transporter',
    equipment_owner: 'Equipment Owner',
    investor: 'Investor',
  };

  return (
    <LinearGradient
      colors={[Colors.splashBg, '#122E1A', '#0A1F0F']}
      style={styles.container}
    >
      {/* Check animation */}
      <Animated.View style={[styles.checkWrap, { transform: [{ scale: checkScale }] }]}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={52} color={Colors.white} />
        </View>
        <View style={styles.checkRing1} />
        <View style={styles.checkRing2} />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: contentOpacity, transform: [{ translateY: contentY }] },
        ]}
      >
        <Text style={styles.title}>Account Created! 🎉</Text>
        <Text style={styles.subtitle}>
          Welcome to FarmLink as a{'\n'}
          <Text style={styles.roleText}>{roleLabel[role]}</Text>
        </Text>

        {/* Perks */}
        <View style={styles.perksCard}>
          <Text style={styles.perksTitle}>What you get:</Text>
          {(ROLE_PERKS[role] || []).map((perk, i) => (
            <View key={i} style={styles.perkRow}>
              <View style={styles.perkDot}>
                <Ionicons name="checkmark" size={12} color={Colors.white} />
              </View>
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        <Button
          label="Go to Dashboard"
          onPress={handleContinue}
          size="xl"
          style={styles.ctaBtn}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
  },
  checkWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[8],
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: Colors.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  checkRing1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(76,175,80,0.3)',
  },
  checkRing2: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.15)',
  },
  content: { alignItems: 'center', width: '100%' },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: Spacing[6],
  },
  roleText: {
    fontFamily: FontFamily.bold,
    color: Colors.primaryLight,
  },
  perksCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.xl,
    padding: Spacing[5],
    width: '100%',
    marginBottom: Spacing[6],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  perksTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
    marginBottom: Spacing[3],
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  perkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  ctaBtn: { width: '100%' },
});
