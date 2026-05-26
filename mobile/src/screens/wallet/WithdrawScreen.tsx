import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Header, Input, Button } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<WalletStackParamList, 'Withdraw'>;

export default function WithdrawScreen({ navigation }: Props) {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const balance = 45200;

  const handleWithdraw = async () => {
    const val = parseInt(amount, 10);
    if (!val || val < 1000) { Alert.alert('Minimum', 'Minimum withdrawal is ₦1,000.'); return; }
    if (val > balance) { Alert.alert('Insufficient', 'You do not have enough balance.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      Alert.alert('Withdrawal Initiated', `₦${formatCurrency(val)} will arrive in your bank account within 24 hours.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.flex}>
      <Header title="Withdraw" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        </View>
        <Input label="Amount (₦)" placeholder="e.g. 20000" value={amount} onChangeText={setAmount} keyboardType="number-pad" required />
        <Input label="Bank Name" placeholder="e.g. GTBank" value={bankName} onChangeText={setBankName} required />
        <Input label="Account Number" placeholder="10-digit account number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" maxLength={10} required />
        <Button label="Withdraw Funds" onPress={handleWithdraw} loading={loading} size="lg" style={styles.btn} />
        <Text style={styles.note}>Withdrawals are processed within 24 hours on business days.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primaryTint, borderRadius: 12, padding: Spacing[4], marginBottom: Spacing[5] },
  balanceLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  balanceAmount: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.primary },
  btn: { marginTop: Spacing[4] },
  note: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing[3], lineHeight: 18 },
});
