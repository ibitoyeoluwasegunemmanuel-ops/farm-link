import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const ITEMS: { icon: string; label: string; route: keyof ProfileStackParamList }[] = [
    { icon: 'notifications-outline', label: 'Notifications', route: 'NotificationSettings' },
    { icon: 'lock-closed-outline', label: 'Privacy', route: 'PrivacySettings' },
    { icon: 'shield-outline', label: 'Security', route: 'SecuritySettings' },
    { icon: 'person-circle-outline', label: 'Account', route: 'AccountSettings' },
  ];
  return (
    <View style={styles.flex}>
      <Header title="Settings" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.item, i < ITEMS.length - 1 && styles.itemBorder]}
              onPress={() => navigation.navigate(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.label}>{item.label}</Text>
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
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  label: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
});
