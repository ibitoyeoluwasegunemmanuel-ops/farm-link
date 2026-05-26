import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius, Shadow } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'CropScanner'>;

type ScanState = 'idle' | 'scanning' | 'result';

const MOCK_RESULT = {
  disease: 'Early Blight (Alternaria solani)',
  crop: 'Tomato',
  confidence: 94,
  severity: 'Moderate',
  description: 'Early blight is a fungal disease causing dark brown spots with concentric rings on leaves, stems, and fruit. It typically starts on lower/older leaves.',
  treatments: [
    'Remove and destroy infected leaves immediately',
    'Apply copper-based fungicide (e.g., Copper Oxychloride 50% WP)',
    'Improve air circulation by pruning dense foliage',
    'Avoid overhead irrigation — use drip irrigation instead',
    'Apply Mancozeb 80% WP as preventive spray every 7–10 days',
  ],
  prevention: [
    'Use certified disease-free seeds',
    'Practice crop rotation (avoid planting tomatoes in same field for 2–3 years)',
    'Maintain proper spacing (60cm × 45cm)',
    'Mulch around plants to prevent soil splash',
  ],
};

export default function CropScannerScreen({ navigation }: Props) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCapture = async () => {
    setScanState('scanning');
    await new Promise(r => setTimeout(r, 2500));
    setScanState('result');
  };

  const handleReset = () => {
    setScanState('idle');
    setImageUri(null);
  };

  const getSeverityColor = (s: string) => {
    if (s === 'Mild') return Colors.success;
    if (s === 'Moderate') return Colors.warning;
    return Colors.error;
  };

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.headerGrad}>
        <Header title="Crop Disease Scanner" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <Text style={styles.headerSub}>Point camera at affected crop for instant diagnosis</Text>
      </LinearGradient>

      {scanState === 'idle' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.cameraBox}>
            <View style={styles.cameraPlaceholder}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              <Ionicons name="camera" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={styles.cameraHint}>Frame the affected area</Text>
            </View>
            <View style={styles.cameraActions}>
              <TouchableOpacity style={styles.galleryBtn} onPress={() => Alert.alert('Gallery', 'Pick from gallery coming soon')}>
                <Ionicons name="images-outline" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryBtn} onPress={() => Alert.alert('Flash', 'Flash control coming soon')}>
                <Ionicons name="flash-outline" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Tips for best results</Text>
            {[
              { icon: 'sunny-outline', tip: 'Ensure good lighting — natural light works best' },
              { icon: 'expand-outline', tip: 'Fill the frame with the affected leaf or area' },
              { icon: 'eye-outline', tip: 'Focus on clear, visible symptoms' },
              { icon: 'camera-reverse-outline', tip: 'Take multiple photos from different angles' },
            ].map((t, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipIcon}>
                  <Ionicons name={t.icon as any} size={16} color={Colors.primary} />
                </View>
                <Text style={styles.tipText}>{t.tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.supportedCard}>
            <Text style={styles.tipsTitle}>Supported Crops</Text>
            <View style={styles.cropGrid}>
              {['Tomato', 'Maize', 'Cassava', 'Yam', 'Rice', 'Pepper', 'Plantain', 'Cocoa'].map((c, i) => (
                <View key={i} style={styles.cropChip}>
                  <Text style={styles.cropChipText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {scanState === 'scanning' && (
        <View style={styles.scanningContainer}>
          <View style={styles.scanningBox}>
            <View style={styles.scanLine} />
            <Ionicons name="leaf" size={64} color={Colors.primary} style={{ opacity: 0.3 }} />
          </View>
          <Text style={styles.scanningTitle}>Analyzing crop...</Text>
          <Text style={styles.scanningSubtitle}>AI is examining leaf patterns, color changes, and disease markers</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>
      )}

      {scanState === 'result' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultHeader}>
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.resultIconBox}>
              <Ionicons name="leaf" size={28} color={Colors.white} />
            </LinearGradient>
            <View style={styles.resultHeaderText}>
              <Text style={styles.diseaseTitle}>{MOCK_RESULT.disease}</Text>
              <Text style={styles.cropLabel}>{MOCK_RESULT.crop}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{MOCK_RESULT.confidence}%</Text>
              <Text style={styles.statLabel}>Confidence</Text>
            </View>
            <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.borderLight }]}>
              <Text style={[styles.statVal, { color: getSeverityColor(MOCK_RESULT.severity) }]}>{MOCK_RESULT.severity}</Text>
              <Text style={styles.statLabel}>Severity</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>Fungal</Text>
              <Text style={styles.statLabel}>Type</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Disease</Text>
            <Text style={styles.descText}>{MOCK_RESULT.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Treatment</Text>
            {MOCK_RESULT.treatments.map((t, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.listBullet}><Text style={styles.listNum}>{i + 1}</Text></View>
                <Text style={styles.listText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prevention</Text>
            {MOCK_RESULT.prevention.map((p, i) => (
              <View key={i} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} style={{ marginTop: 2 }} />
                <Text style={styles.listText}>{p}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
              <Ionicons name="camera" size={18} color={Colors.primary} />
              <Text style={styles.secondaryBtnText}>Scan Another</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('AIAssistant')}>
              <Ionicons name="chatbubble-ellipses" size={18} color={Colors.white} />
              <Text style={styles.primaryBtnText}>Ask AI More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  headerSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: Spacing[6], marginTop: -Spacing[2] },
  content: { padding: Spacing[4] },
  cameraBox: { backgroundColor: '#000', borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing[4] },
  cameraPlaceholder: { height: 320, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  cornerTL: { position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Colors.primaryLight },
  cornerTR: { position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: Colors.primaryLight },
  cornerBL: { position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Colors.primaryLight },
  cornerBR: { position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Colors.primaryLight },
  cameraHint: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: Spacing[3] },
  cameraActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: Spacing[5], backgroundColor: '#000' },
  galleryBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
  captureBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.white },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.white },
  tipsCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  tipsTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], marginBottom: Spacing[2] },
  tipIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  tipText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  supportedCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginTop: Spacing[2] },
  cropChip: { backgroundColor: Colors.primaryTint, borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1] },
  cropChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.primary },
  scanningContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  scanningBox: { width: 200, height: 200, borderRadius: Radius.xl, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[6], overflow: 'hidden' },
  scanLine: { position: 'absolute', top: '40%', left: 0, right: 0, height: 2, backgroundColor: Colors.primary, opacity: 0.7 },
  scanningTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl, color: Colors.textPrimary, marginBottom: Spacing[2] },
  scanningSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing[6] },
  progressBar: { width: '100%', height: 6, backgroundColor: Colors.borderLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  resultIconBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  resultHeaderText: { flex: 1 },
  diseaseTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  cropLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.lg, marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  statBox: { flex: 1, alignItems: 'center', padding: Spacing[4] },
  statVal: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.textPrimary },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  section: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  descText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], marginBottom: Spacing[3] },
  listBullet: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  listNum: { fontFamily: FontFamily.bold, fontSize: 11, color: Colors.white },
  listText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: Spacing[3], marginBottom: Spacing[4] },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.primary, paddingVertical: Spacing[3] },
  secondaryBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primary },
  primaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], borderRadius: Radius.lg, backgroundColor: Colors.primary, paddingVertical: Spacing[3] },
  primaryBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
});
