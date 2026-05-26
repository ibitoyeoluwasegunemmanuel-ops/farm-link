import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Header, Input, Button } from '../../components/common';

type Props = NativeStackScreenProps<WalletStackParamList, 'SendMoney'>;

export default function SendMoneyScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!phone || !amount) { Alert.alert('Required', 'Please enter recipient and amount.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      Alert.alert('Sent!', `₦${amount} sent successfully.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.flex}>
      <Header title="Send Money" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Recipient Phone Number" placeholder="+234 or 080..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" required />
        <Input label="Amount (₦)" placeholder="e.g. 10000" value={amount} onChangeText={setAmount} keyboardType="number-pad" required />
        <Input label="Note (optional)" placeholder="e.g. Payment for cassava" value={note} onChangeText={setNote} />
        <Button label="Send Money" onPress={handleSend} loading={loading} size="lg" style={styles.btn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  btn: { marginTop: Spacing[4] },
});
