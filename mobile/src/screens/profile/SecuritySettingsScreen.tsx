import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SecuritySettings'>;

export default function SecuritySettingsScreen({ navigation }: Props) {
  const ITEMS = [
    { icon: 'phone-portrait-outline', label: 'Change Phone Number', sub: '+234 •••• ••34' },
    { icon: 'finger-print-outline', label: 'Biometric Login', sub: 'Use Face ID / Fingerprint' },
    { icon: 'devices-outline', label: 'Active Sessions', sub: '2 devices logged in' },
    { icon: 'lock-closed-outline', label: 'PIN Settings', sub: 'Set transaction PIN' },
  ];
  return (
    <View style={styles.flex}>
      <Header title="Security" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity key={item.label} style={[styles.item, i < ITEMS.length - 1 && styles.border]}>
              <View style={styles.iconWrap}><Ionicons name={item.icon as any} size={18} color={Colors.primary} /></View>
              <View style={styles.info}><Text style={styles.label}>{item.label}</Text><Text style={styles.sub}>{item.sub}</Text></View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[4] },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});
