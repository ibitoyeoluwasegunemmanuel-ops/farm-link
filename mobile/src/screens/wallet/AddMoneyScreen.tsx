import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, Button, Input } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<WalletStackParamList, 'AddMoney'>;

const PRESETS = [5000, 10000, 20000, 50000, 100000, 200000];

export default function AddMoneyScreen({ navigation }: Props) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    const val = parseInt(amount.replace(/,/g, ''), 10);
    if (!val || val < 500) { Alert.alert('Minimum', 'Minimum funding amount is ₦500.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      Alert.alert('Success', `₦${formatCurrency(val)} has been added to your wallet.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.flex}>
      <Header title="Add Money" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.amountLabel}>How much would you like to add?</Text>
        <View style={styles.amountInput}>
          <Text style={styles.naira}>₦</Text>
          <Input
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            containerStyle={styles.amountField}
            inputStyle={styles.amountText}
          />
        </View>

        <View style={styles.presets}>
          {PRESETS.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.presetChip, amount === p.toString() && styles.presetChipActive]}
              onPress={() => setAmount(p.toString())}
            >
              <Text style={[styles.presetText, amount === p.toString() && styles.presetTextActive]}>
                ₦{(p / 1000).toFixed(0)}K
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.methodTitle}>Payment Method</Text>
        {([
          { key: 'card', label: 'Debit/Credit Card', sub: 'Instant · 1.5% fee' },
          { key: 'transfer', label: 'Bank Transfer', sub: 'Free · 5-10 mins' },
          { key: 'ussd', label: 'USSD', sub: 'Free · All networks' },
        ] as const).map(m => (
          <TouchableOpacity
            key={m.key}
            style={[styles.methodItem, method === m.key && styles.methodItemActive]}
            onPress={() => setMethod(m.key)}
          >
            <View style={[styles.radio, method === m.key && styles.radioActive]}>
              {method === m.key && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Button label="Fund Wallet" onPress={handleFund} loading={loading} size="lg" style={styles.btn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4], paddingBottom: 40 },
  amountLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, color: Colors.textPrimary, marginBottom: Spacing[4] },
  amountInput: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[4] },
  naira: { fontFamily: FontFamily.bold, fontSize: 32, color: Colors.textPrimary },
  amountField: { flex: 1, marginBottom: 0 },
  amountText: { fontSize: 32, fontFamily: FontFamily.bold },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginBottom: Spacing[6] },
  presetChip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing[4], paddingVertical: Spacing[2] },
  presetChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryTint },
  presetText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  presetTextActive: { color: Colors.primary },
  methodTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  methodItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing[4], marginBottom: Spacing[2], borderWidth: 1.5, borderColor: Colors.borderLight },
  methodItemActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryTint },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  methodLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  methodSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  btn: { marginTop: Spacing[4] },
});
