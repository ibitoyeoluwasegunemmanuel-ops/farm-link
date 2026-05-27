import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, Input, Header } from '../../components/common';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';
import { handleApiError } from '../../services/api';
import { NIGERIAN_STATES } from '../../constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateProfile'>;

const ROLE_LABEL: Record<string, string> = {
  farmer: 'Farmer',
  buyer: 'Buyer / Trader',
  transporter: 'Transporter',
  equipment_owner: 'Equipment Owner',
  investor: 'Investor',
};

export default function CreateProfileScreen({ navigation, route }: Props) {
  const { userId, role } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [farmName, setFarmName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const pickAvatar = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Take Photo', 'Choose from Library'], cancelButtonIndex: 0 },
        async (idx) => {
          if (idx === 1) await takePhoto();
          if (idx === 2) await pickFromLibrary();
        }
      );
    } else {
      await pickFromLibrary();
    }
  };

  const pickFromLibrary = async () => {
    const asset = await storageService.pickImage(true, [1, 1]);
    if (asset) {
      setAvatarUri(asset.uri);
      setAvatarBase64(asset.base64 ?? null);
    }
  };

  const takePhoto = async () => {
    const asset = await storageService.takePhoto(true, [1, 1]);
    if (asset) {
      setAvatarUri(asset.uri);
      setAvatarBase64(asset.base64 ?? null);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!state) {
      Alert.alert('Required', 'Please select your state.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.createProfile(userId, {
        fullName: name.trim(),
        email: email.trim() || undefined,
        state,
        farmName: farmName.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      navigation.replace('KYC', { userId });
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
      <Header
        title="Create Profile"
        subtitle={`Setting up as ${ROLE_LABEL[role]}`}
        showBack
        onBack={() => navigation.goBack()}
        dark
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar picker */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color={Colors.primary} />
              </View>
            )}
            <View style={styles.avatarEdit}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to add photo</Text>
        </View>

        <Input
          label="Full Name"
          placeholder="e.g. Emeka Okafor"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          required
        />

        <Input
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          hint="Optional but recommended"
        />

        {/* State selector */}
        <View style={styles.stateWrap}>
          <Text style={styles.stateLabel}>State <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.stateBtn}
            onPress={() => setShowStatePicker(!showStatePicker)}
          >
            <Text style={[styles.stateValue, !state && styles.statePlaceholder]}>
              {state || 'Select your state'}
            </Text>
            <Ionicons
              name={showStatePicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
          {showStatePicker && (
            <View style={styles.stateList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {NIGERIAN_STATES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.stateItem, state === s && styles.stateItemSelected]}
                    onPress={() => { setState(s); setShowStatePicker(false); }}
                  >
                    <Text style={[styles.stateItemText, state === s && styles.stateItemTextSelected]}>
                      {s}
                    </Text>
                    {state === s && (
                      <Ionicons name="checkmark" size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {(role === 'farmer' || role === 'equipment_owner') && (
          <Input
            label={role === 'farmer' ? 'Farm Name' : 'Business Name'}
            placeholder={role === 'farmer' ? 'e.g. Okafor Green Farm' : 'e.g. AgriMech Services'}
            value={farmName}
            onChangeText={setFarmName}
            autoCapitalize="words"
            hint="Optional"
          />
        )}

        <Input
          label="Short Bio"
          placeholder="Tell buyers a bit about yourself or your farm..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
          hint="Optional — shown on your public profile"
        />

        <Button
          label="Continue"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          style={styles.ctaBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: Spacing[2],
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  stateWrap: { marginBottom: Spacing[4] },
  stateLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  required: { color: Colors.error },
  stateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 52,
    paddingHorizontal: Spacing[4],
  },
  stateValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  statePlaceholder: { color: Colors.textTertiary },
  stateList: {
    marginTop: 4,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  stateItemSelected: { backgroundColor: Colors.primaryTint },
  stateItemText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  stateItemTextSelected: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },
  ctaBtn: { marginTop: Spacing[2] },
});
