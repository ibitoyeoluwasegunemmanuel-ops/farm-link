import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightAction?: { label: string; onPress: () => void };
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  rightAction,
  containerStyle,
  inputStyle,
  isPassword = false,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? Colors.error
    : isFocused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <View
        style={[
          styles.container,
          { borderColor },
          isFocused && styles.focused,
          error ? styles.errorBorder : null,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, inputStyle]}
          placeholderTextColor={Colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {!isPassword && rightIcon && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}

        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightAction}>
            <Text style={styles.rightActionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

// Phone number input with country code
interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  containerStyle?: ViewStyle;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  label,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          { borderColor: error ? Colors.error : isFocused ? Colors.primary : Colors.border },
          isFocused && styles.focused,
        ]}
      >
        {/* Nigeria flag + code */}
        <View style={styles.countryCode}>
          <Text style={styles.flag}>🇳🇬</Text>
          <Text style={styles.dialCode}>+234</Text>
          <View style={styles.codeDivider} />
        </View>

        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="801 234 5678"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="phone-pad"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={11}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// OTP input
interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange }) => {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOTP = value.split('');
    newOTP[index] = text;
    const joined = newOTP.join('').slice(0, length);
    onChange(joined);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => { inputs.current[i] = ref; }}
            style={[
              styles.otpBox,
              value[i] ? styles.otpFilled : null,
            ]}
            value={value[i] || ''}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing[4] },

  labelRow: { flexDirection: 'row', marginBottom: Spacing[2] },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  required: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.error,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 52,
    paddingHorizontal: Spacing[4],
  },
  focused: { backgroundColor: Colors.white },
  errorBorder: { borderColor: Colors.error },

  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingVertical: Spacing[3],
  },
  inputWithLeft: { marginLeft: Spacing[2] },

  leftIcon: { marginRight: Spacing[2] },
  rightIcon: { marginLeft: Spacing[2] },
  rightAction: { marginLeft: Spacing[2] },
  rightActionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing[1] },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginLeft: 4,
    marginTop: Spacing[1],
  },
  hint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing[1],
  },

  // Phone input
  countryCode: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing[3] },
  flag: { fontSize: 20, marginRight: 4 },
  dialCode: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  codeDivider: { width: 1, height: 20, backgroundColor: Colors.border, marginLeft: Spacing[3] },
  phoneInput: { flex: 1 },

  // OTP input
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },
  otpBox: {
    width: 52,
    height: 60,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
  },
  otpFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
    color: Colors.primary,
  },
});
