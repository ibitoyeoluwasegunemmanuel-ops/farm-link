import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NotificationSettings'>;

const NOTIF_ITEMS = [
  { key: 'orders', label: 'Order Updates', sub: 'New orders, status changes', default: true },
  { key: 'messages', label: 'Messages', sub: 'New chat messages', default: true },
  { key: 'logistics', label: 'Delivery Alerts', sub: 'Pickup, in-transit, delivered', default: true },
  { key: 'market', label: 'Market Prices', sub: 'Daily price alerts for your crops', default: false },
  { key: 'promo', label: 'Promotions', sub: 'Deals and offers', default: false },
];

export default function NotificationSettingsScreen({ navigation }: Props) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(i => [i.key, i.default]))
  );

  return (
    <View style={styles.flex}>
      <Header title="Notifications" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {NOTIF_ITEMS.map((item, i) => (
            <View key={item.key} style={[styles.item, i < NOTIF_ITEMS.length - 1 && styles.itemBorder]}>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.sub}>{item.sub}</Text>
              </View>
              <Switch
                value={toggles[item.key]}
                onValueChange={v => setToggles(t => ({ ...t, [item.key]: v }))}
                trackColor={{ true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
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
  item: { flexDirection: 'row', alignItems: 'center', padding: Spacing[4], gap: Spacing[3] },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});
