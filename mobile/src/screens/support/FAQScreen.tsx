import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'FAQ'>;

const FAQS = [
  { q: 'How does the escrow system work?', a: 'When you place an order, your payment is held securely by FarmLink. The money is only released to the farmer once you confirm delivery receipt.' },
  { q: 'How do I become a verified farmer?', a: 'Complete your profile, submit KYC documents (NIN + selfie), and pass our verification process. It usually takes 24-48 hours.' },
  { q: 'What fees does FarmLink charge?', a: 'We charge a 2% platform fee on marketplace transactions and 5% on logistics bookings. There are no hidden charges.' },
  { q: 'Can I sell from any state in Nigeria?', a: 'Yes! FarmLink works across all 36 states of Nigeria. Logistics coverage varies by location.' },
  { q: 'How do I withdraw my earnings?', a: 'Go to Wallet → Withdraw and enter your bank details. Withdrawals are processed within 24 hours on business days.' },
];

export default function FAQScreen({ navigation }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <View style={styles.flex}>
      <Header title="FAQ" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={FAQS}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.content}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.item} onPress={() => setExpanded(expanded === index ? null : index)}>
            <View style={styles.qRow}>
              <Text style={styles.q}>{item.q}</Text>
              <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary} />
            </View>
            {expanded === index && <Text style={styles.a}>{item.a}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  item: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.borderLight },
  qRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing[3] },
  q: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1 },
  a: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing[3], lineHeight: 22 },
});
