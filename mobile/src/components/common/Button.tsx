import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

const SIZE_CONFIG = {
  sm: { height: 36, paddingH: 16, fontSize: FontSize.sm, radius: Radius.md },
  md: { height: 44, paddingH: 20, fontSize: FontSize.base, radius: Radius.md },
  lg: { height: 52, paddingH: 24, fontSize: FontSize.md, radius: Radius.lg },
  xl: { height: 56, paddingH: 28, fontSize: FontSize.md, radius: Radius.lg },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
  haptic = true,
}) => {
  const config = SIZE_CONFIG[size];

  const handlePress = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    height: config.height,
    paddingHorizontal: config.paddingH,
    borderRadius: config.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: fullWidth ? '100%' : undefined,
    opacity: isDisabled ? 0.55 : 1,
  };

  const labelStyle: TextStyle = {
    fontFamily: FontFamily.semiBold,
    fontSize: config.fontSize,
    letterSpacing: 0.3,
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{ borderRadius: config.radius, overflow: 'hidden', width: fullWidth ? '100%' : undefined }, style]}
      >
        <LinearGradient
          colors={['#1B5E20', '#2E7D32']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={containerStyle}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <View style={styles.iconLeft}>{icon}</View>
              )}
              <Text style={[labelStyle, { color: Colors.white }, textStyle]}>
                {label}
              </Text>
              {icon && iconPosition === 'right' && (
                <View style={styles.iconRight}>{icon}</View>
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: Colors.primary },
      text: { color: Colors.white },
    },
    secondary: {
      container: { backgroundColor: Colors.primaryTint },
      text: { color: Colors.primary },
    },
    outline: {
      container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
      text: { color: Colors.primary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: Colors.primary },
    },
    danger: {
      container: { backgroundColor: Colors.error },
      text: { color: Colors.white },
    },
    gradient: {
      container: { backgroundColor: Colors.primary },
      text: { color: Colors.white },
    },
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[containerStyle, variantStyles[variant].container, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' || variant === 'secondary'
            ? Colors.primary
            : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[labelStyle, variantStyles[variant].text, textStyle]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: { marginRight: Spacing[2] },
  iconRight: { marginLeft: Spacing[2] },
});
