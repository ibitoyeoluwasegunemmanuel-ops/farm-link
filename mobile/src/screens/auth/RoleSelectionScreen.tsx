import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import { authService } from '../../services/authService';
import { handleApiError } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'RoleSelection'>;

interface RoleOption {
  role: UserRole;
  icon: string;
  label: string;
  description: string;
  gradient: [string, string];
  highlight: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'farmer',
    icon: 'leaf',
    label: 'Farmer',
    description: 'Sell your produce, manage harvests, access inputs & AI tools',
    gradient: ['#1B5E20', '#2E7D32'],
    highlight: '#4CAF50',
  },
  {
    role: 'buyer',
    icon: 'cart',
    label: 'Buyer / Trader',
    description: 'Buy directly from farms, manage orders, track deliveries',
    gradient: ['#0D47A1', '#1565C0'],
    highlight: '#2196F3',
  },
  {
    role: 'transporter',
    icon: 'cube',
    label: 'Transporter / Driver',
    description: 'Accept delivery jobs, earn money with your vehicle',
    gradient: ['#E65100', '#F57C00'],
    highlight: '#FF9800',
  },
  {
    role: 'equipment_owner',
    icon: 'construct',
    label: 'Equipment Owner',
    description: 'Rent out tractors, harvesters and farm equipment',
    gradient: ['#4A148C', '#6A1B9A'],
    highlight: '#9C27B0',
  },
  {
    role: 'investor',
    icon: 'trending-up',
    label: 'Investor',
    description: 'Fund farms, earn returns, build your agri-investment portfolio',
    gradient: ['#B71C1C', '#C62828'],
    highlight: '#F44336',
  },
];

export default function RoleSelectionScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (role: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(role);
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Select a Role', 'Please choose how you want to use FarmLink.');
      return;
    }
    setLoading(true);
    try {
      await authService.setRole(userId, selected);
      navigation.replace('CreateProfile', { userId, role: selected });
    } catch (err) {
      Alert.alert('Error', handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      {/* Header */}
      <LinearGradient colors={[Colors.splashBg, '#1A3524']} style={styles.header}>
        <Text style={styles.headerTitle}>I am a...</Text>
        <Text style={styles.headerSubtitle}>
          Choose your role to personalise your FarmLink experience
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {ROLES.map((r) => {
          const isSelected = selected === r.role;
          return (
            <TouchableOpacity
              key={r.role}
              style={[styles.roleCard, isSelected && styles.roleCardSelected]}
              onPress={() => handleSelect(r.role)}
              activeOpacity={0.88}
            >
              {/* Icon */}
              <LinearGradient
                colors={isSelected ? r.gradient : ['#F5F5F5', '#EEEEEE']}
                style={styles.roleIcon}
              >
                <Ionicons
                  name={r.icon as any}
                  size={26}
                  color={isSelected ? Colors.white : Colors.textSecondary}
                />
              </LinearGradient>

              {/* Text */}
              <View style={styles.roleInfo}>
                <Text style={[styles.roleLabel, isSelected && { color: Colors.primary }]}>
                  {r.label}
                </Text>
                <Text style={styles.roleDesc}>{r.description}</Text>
              </View>

              {/* Check */}
              <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                {isSelected && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <Button
          label="Continue"
          onPress={handleContinue}
          loading={loading}
          size="lg"
          style={styles.ctaBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[8],
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    marginBottom: Spacing[2],
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 24,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing[4], paddingTop: Spacing[5], paddingBottom: 40 },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    gap: Spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: { flex: 1 },
  roleLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  roleDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  ctaBtn: { marginTop: Spacing[4] },
});
