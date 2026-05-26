import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  radius?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = Spacing[4],
  radius = Radius.lg,
  shadow = 'sm',
  border = false,
}) => {
  const shadowStyle = shadow !== 'none' ? Shadow[shadow] : {};

  const cardStyle: ViewStyle = {
    backgroundColor: Colors.white,
    borderRadius: radius,
    padding,
    ...(shadowStyle as ViewStyle),
    ...(border ? { borderWidth: 1, borderColor: Colors.borderLight } : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

// Section card with header
interface SectionCardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  action,
  children,
  style,
}) => (
  <Card style={[styles.section, style]}>
    {(title || action) && (
      <View style={styles.sectionHeader}>
        {title && (
          <View style={styles.sectionTitleRow}>
            {/* Title rendered by parent - just layout */}
          </View>
        )}
        {action}
      </View>
    )}
    {children}
  </Card>
);

const styles = StyleSheet.create({
  section: { marginBottom: Spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitleRow: { flex: 1 },
});
