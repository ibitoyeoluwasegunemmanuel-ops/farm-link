import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'verified';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: Colors.primaryTint, text: Colors.primary },
  success: { bg: Colors.successBg, text: Colors.success },
  warning: { bg: Colors.warningBg, text: Colors.warning },
  error: { bg: Colors.errorBg, text: Colors.error },
  info: { bg: Colors.infoBg, text: Colors.info },
  neutral: { bg: Colors.borderLight, text: Colors.textSecondary },
  verified: { bg: Colors.primaryTint, text: Colors.primary, border: Colors.primary },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'sm',
  icon,
  style,
}) => {
  const v = VARIANT_STYLES[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: v.bg,
          paddingHorizontal: isSmall ? Spacing[2] : Spacing[3],
          paddingVertical: isSmall ? 3 : 5,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={isSmall ? 11 : 13}
          color={v.text}
          style={{ marginRight: 3 }}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: v.text, fontSize: isSmall ? FontSize.xs : FontSize.sm },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

// Verified Farmer badge - matches design exactly
export const VerifiedBadge: React.FC<{ label?: string; style?: ViewStyle }> = ({
  label = 'Verified Farmer',
  style,
}) => (
  <View style={[styles.verifiedBadge, style]}>
    <Ionicons name="checkmark-circle" size={12} color={Colors.primary} />
    <Text style={styles.verifiedLabel}>{label}</Text>
  </View>
);

// Notification dot badge
export const NotifBadge: React.FC<{ count: number; style?: ViewStyle }> = ({ count, style }) => {
  if (count === 0) return null;
  return (
    <View style={[styles.notifBadge, style]}>
      <Text style={styles.notifCount}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

// Order status badge
export const StatusBadge: React.FC<{ status: string; style?: ViewStyle }> = ({ status, style }) => {
  const statusMap: Record<string, BadgeVariant> = {
    pending: 'warning',
    confirmed: 'info',
    in_transit: 'primary',
    delivered: 'success',
    completed: 'success',
    cancelled: 'error',
    disputed: 'error',
  };

  const labelMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  };

  return (
    <Badge
      label={labelMap[status] || status}
      variant={statusMap[status] || 'neutral'}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: FontFamily.semiBold,
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    gap: 3,
  },
  verifiedLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },

  notifBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifCount: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
  },
});
