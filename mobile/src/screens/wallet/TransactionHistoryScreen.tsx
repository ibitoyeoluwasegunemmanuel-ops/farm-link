import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<WalletStackParamList, 'TransactionHistory'>;

const TRANSACTIONS = [
  { id: '1', type: 'credit', label: 'Sale: White Maize', amount: 550000, date: 'Dec 5, 2024', icon: 'trending-up' },
  { id: '2', type: 'debit', label: 'Purchase: Cassava', amount: 47500, date: 'Dec 4, 2024', icon: 'cart' },
  { id: '3', type: 'debit', label: 'Logistics: Lagos→Abuja', amount: 35000, date: 'Dec 3, 2024', icon: 'cube' },
  { id: '4', type: 'credit', label: 'Escrow Release', amount: 220000, date: 'Dec 1, 2024', icon: 'shield-checkmark' },
  { id: '5', type: 'debit', label: 'Withdrawal to GTBank', amount: 100000, date: 'Nov 28, 2024', icon: 'arrow-up' },
  { id: '6', type: 'credit', label: 'Add Money via Card', amount: 50000, date: 'Nov 25, 2024', icon: 'card' },
];

export default function TransactionHistoryScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="All Transactions" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
          >
            <View style={[styles.icon, { backgroundColor: item.type === 'credit' ? Colors.success + '20' : Colors.error + '20' }]}>
              <Ionicons name={item.icon as any} size={18} color={item.type === 'credit' ? Colors.success : Colors.error} />
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, item.type === 'credit' ? styles.credit : styles.debit]}>
              {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing[4] },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.borderLight },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  date: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  credit: { color: Colors.success },
  debit: { color: Colors.error },
});
