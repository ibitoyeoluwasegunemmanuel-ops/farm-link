import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'leaf-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
  compact = false,
}) => (
  <View style={[styles.container, compact && styles.containerCompact, style]}>
    <View style={[styles.iconWrap, compact && styles.iconWrapCompact]}>
      <Ionicons
        name={icon as any}
        size={compact ? 28 : 40}
        color={Colors.primary}
      />
    </View>
    <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
    {description && (
      <Text style={[styles.desc, compact && styles.descCompact]}>{description}</Text>
    )}
    {actionLabel && onAction && (
      <Button
        label={actionLabel}
        onPress={onAction}
        size="md"
        style={styles.action}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    paddingVertical: Spacing[12],
  },
  containerCompact: {
    paddingVertical: Spacing[8],
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  iconWrapCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: Spacing[3],
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  titleCompact: {
    fontSize: FontSize.base,
  },
  desc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  descCompact: {
    fontSize: FontSize.xs,
  },
  action: {
    marginTop: Spacing[5],
    minWidth: 160,
  },
});
