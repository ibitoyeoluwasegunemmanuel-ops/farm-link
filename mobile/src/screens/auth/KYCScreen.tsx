import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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

type Props = NativeStackScreenProps<AuthStackParamList, 'KYC'>;

type DocType = 'nin' | 'passport' | 'drivers_license' | 'voter_id';

const DOC_OPTIONS: { type: DocType; label: string; icon: string }[] = [
  { type: 'nin', label: 'NIN (National ID)', icon: 'card-outline' },
  { type: 'passport', label: 'International Passport', icon: 'globe-outline' },
  { type: 'drivers_license', label: "Driver's License", icon: 'car-outline' },
  { type: 'voter_id', label: 'Voter Card', icon: 'people-outline' },
];

export default function KYCScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const [docType, setDocType] = useState<DocType>('nin');
  const [ninNumber, setNinNumber] = useState('');
  const [docFront, setDocFront] = useState<{ uri: string; base64: string } | null>(null);
  const [docBack, setDocBack] = useState<{ uri: string; base64: string } | null>(null);
  const [selfie, setSelfie] = useState<{ uri: string; base64: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

  const pickDoc = async (side: 'front' | 'back') => {
    const asset = await storageService.pickImage(false, [4, 3]);
    if (!asset) return;
    const item = { uri: asset.uri, base64: asset.base64 ?? '' };
    if (side === 'front') setDocFront(item);
    else setDocBack(item);
  };

  const takeSelfie = async () => {
    const asset = await storageService.takePhoto(true, [1, 1]);
    if (!asset) return;
    setSelfie({ uri: asset.uri, base64: asset.base64 ?? '' });
  };

  const handleSubmit = async () => {
    if (!docFront || !selfie) {
      Alert.alert('Required', 'Please upload your ID document and take a selfie.');
      return;
    }
    setLoading(true);
    try {
      await authService.submitKYC(userId, {
        ninNumber: docType === 'nin' ? ninNumber : undefined,
        docType,
        docFrontBase64: docFront.base64,
        docBackBase64: docBack?.base64,
        selfieBase64: selfie.base64,
      });
      // Navigate to success — role comes from earlier state; use 'farmer' as fallback
      navigation.replace('AccountCreated', { role: 'farmer' });
    } catch (err) {
      Alert.alert('Error', handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('AccountCreated', { role: 'farmer' });
  };

  const DocUploadBox = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: { uri: string } | null;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.docBox} onPress={onPress}>
      {value ? (
        <Image source={{ uri: value.uri }} style={styles.docImage} />
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={28} color={Colors.primary} />
          <Text style={styles.docLabel}>{label}</Text>
          <Text style={styles.docHint}>Tap to upload</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.flex}>
      <Header
        title="Identity Verification"
        subtitle="Step 3 of 3"
        showBack
        onBack={() => navigation.goBack()}
        dark
        rightActions={
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Why KYC */}
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            KYC verification builds trust with buyers and unlocks higher transaction limits.
          </Text>
        </View>

        {/* Document type */}
        <Text style={styles.sectionTitle}>Document Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.docTypeScroll}>
          {DOC_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d.type}
              style={[styles.docTypeChip, docType === d.type && styles.docTypeChipActive]}
              onPress={() => setDocType(d.type)}
            >
              <Ionicons
                name={d.icon as any}
                size={16}
                color={docType === d.type ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.docTypeText, docType === d.type && styles.docTypeTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {docType === 'nin' && (
          <Input
            label="NIN Number"
            placeholder="11-digit NIN"
            value={ninNumber}
            onChangeText={setNinNumber}
            keyboardType="number-pad"
            maxLength={11}
            containerStyle={styles.ninInput}
          />
        )}

        {/* Document uploads */}
        <Text style={styles.sectionTitle}>Upload Document</Text>
        <View style={styles.docRow}>
          <DocUploadBox label="Front Side" value={docFront} onPress={() => pickDoc('front')} />
          <DocUploadBox label="Back Side" value={docBack} onPress={() => pickDoc('back')} />
        </View>

        {/* Selfie */}
        <Text style={styles.sectionTitle}>Selfie</Text>
        <TouchableOpacity style={styles.selfieBox} onPress={takeSelfie}>
          {selfie ? (
            <Image source={{ uri: selfie.uri }} style={styles.selfieImage} />
          ) : (
            <>
              <View style={styles.selfieIconWrap}>
                <Ionicons name="camera" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.selfieLabel}>Take a selfie</Text>
              <Text style={styles.selfieHint}>Make sure your face is clearly visible</Text>
            </>
          )}
        </TouchableOpacity>

        <Button
          label="Submit Verification"
          onPress={handleSubmit}
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
  content: { padding: Spacing[4], paddingBottom: 40 },
  skipBtn: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  skipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[5],
  },
  infoText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  docTypeScroll: { marginBottom: Spacing[4] },
  docTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    marginRight: Spacing[2],
    backgroundColor: Colors.white,
  },
  docTypeChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  docTypeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  docTypeTextActive: { color: Colors.primary },
  ninInput: { marginBottom: Spacing[4] },
  docRow: { flexDirection: 'row', gap: Spacing[3], marginBottom: Spacing[4] },
  docBox: {
    flex: 1,
    height: 120,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
    overflow: 'hidden',
  },
  docImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  docLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginTop: 6,
  },
  docHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  selfieBox: {
    height: 180,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
    marginBottom: Spacing[5],
    overflow: 'hidden',
  },
  selfieIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  selfieImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  selfieLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selfieHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  ctaBtn: {},
});
