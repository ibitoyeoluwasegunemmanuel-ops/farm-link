import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<WalletStackParamList, 'WalletHome'>;

const TRANSACTIONS = [
  { id: '1', type: 'credit', label: 'Sale: White Maize', amount: 550000, time: '2h ago', icon: 'trending-up' },
  { id: '2', type: 'debit', label: 'Purchase: Cassava', amount: 47500, time: 'Yesterday', icon: 'cart' },
  { id: '3', type: 'debit', label: 'Logistics: Lagos→Abuja', amount: 35000, time: 'Dec 3', icon: 'cube' },
  { id: '4', type: 'credit', label: 'Escrow Release', amount: 220000, time: 'Dec 1', icon: 'shield-checkmark' },
  { id: '5', type: 'debit', label: 'Withdrawal', amount: 100000, time: 'Nov 28', icon: 'arrow-up' },
];

export default function WalletScreen({ navigation }: Props) {
  const [showBalance, setShowBalance] = useState(true);

  const QUICK_ACTIONS = [
    { label: 'Add Money', icon: 'add-circle-outline', route: 'AddMoney' as const, color: Colors.primary },
    { label: 'Send', icon: 'send-outline', route: 'SendMoney' as const, color: '#2196F3' },
    { label: 'Scan & Pay', icon: 'scan-outline', route: 'ScanPay' as const, color: '#9C27B0' },
    { label: 'Withdraw', icon: 'arrow-up-outline', route: 'Withdraw' as const, color: '#FF9800' },
  ];

  return (
    <View style={styles.flex}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.walletLabel}>FarmLink Wallet</Text>
            <TouchableOpacity onPress={() => setShowBalance(b => !b)}>
              <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? formatCurrency(45200) : '₦ ••••••'}
          </Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          {/* Escrow */}
          <View style={styles.escrowRow}>
            <Ionicons name="lock-closed-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.escrowText}>₦220,000 in escrow</Text>
            <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.route}
              style={styles.actionItem}
              onPress={() => navigation.navigate(a.route)}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.color + '15' }]}>
                <Ionicons name={a.icon as any} size={24} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.txSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txItem}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: tx.id })}
            >
              <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? Colors.success + '20' : Colors.error + '20' }]}>
                <Ionicons name={tx.icon as any} size={18} color={tx.type === 'credit' ? Colors.success : Colors.error} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={[styles.txAmount, tx.type === 'credit' ? styles.txCredit : styles.txDebit]}>
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  balanceCard: { padding: Spacing[6], paddingTop: 60, paddingBottom: Spacing[8] },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[4] },
  walletLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  balanceAmount: { fontFamily: FontFamily.bold, fontSize: 40, color: Colors.white, marginBottom: 4 },
  balanceLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing[4] },
  escrowRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], alignSelf: 'flex-start' },
  escrowText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.white, paddingVertical: Spacing[5], borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  actionItem: { alignItems: 'center', gap: Spacing[2] },
  actionIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary },
  txSection: { padding: Spacing[4] },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[3] },
  txTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  txSeeAll: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.borderLight },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  txTime: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  txAmount: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  txCredit: { color: Colors.success },
  txDebit: { color: Colors.error },
});
