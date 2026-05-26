import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<WalletStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({ navigation, route }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Transaction Details" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={[styles.amount, styles.credit]}>+{formatCurrency(550000)}</Text>
          <Text style={styles.status}>Completed</Text>
        </View>
        <View style={styles.detailCard}>
          {[
            ['Type', 'Credit'],
            ['Reference', `TXN${route.params.transactionId}${Date.now()}`],
            ['Description', 'Sale: White Maize'],
            ['Date', 'Dec 5, 2024 at 10:32 AM'],
            ['Balance After', formatCurrency(45200)],
          ].map(([l, v]) => (
            <View key={l} style={styles.row}>
              <Text style={styles.rowLabel}>{l}</Text>
              <Text style={styles.rowVal}>{v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4], gap: Spacing[3] },
  amountCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing[6], alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  amountLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  amount: { fontFamily: FontFamily.bold, fontSize: 40, marginVertical: Spacing[3] },
  credit: { color: Colors.success },
  status: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.success },
  detailCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  rowVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
});
