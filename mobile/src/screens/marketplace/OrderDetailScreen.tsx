import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, StatusBadge, Button } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'OrderDetail'>;

export default function OrderDetailScreen({ navigation, route }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Order Details" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.idRow}>
            <Text style={styles.orderId}>Order #{route.params.orderId}</Text>
            <StatusBadge status="in_transit" />
          </View>
          <Text style={styles.date}>Placed on Dec 5, 2024</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>White Maize × 10 bags</Text>
            <Text style={styles.itemPrice}>{formatCurrency(550000)}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          {[['Subtotal', 550000], ['Platform fee', 11000], ['Delivery', 8500], ['Total', 569500]].map(([l, v]) => (
            <View key={l as string} style={styles.sumRow}>
              <Text style={styles.sumLabel}>{l}</Text>
              <Text style={[styles.sumVal, l === 'Total' && styles.totalVal]}>{formatCurrency(v as number)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Escrow Status</Text>
          <Text style={styles.escrowStatus}>₦{formatCurrency(569500)} held in escrow</Text>
          <Text style={styles.escrowNote}>Funds will be released to the farmer once you confirm delivery.</Text>
          <Button label="Confirm Delivery Received" onPress={() => {}} size="md" style={{ marginTop: Spacing[4] }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4], gap: Spacing[3] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[1] },
  orderId: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.textPrimary },
  date: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary },
  itemPrice: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primary },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing[2] },
  sumLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  sumVal: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  totalVal: { fontFamily: FontFamily.bold, color: Colors.primary },
  escrowStatus: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary, marginBottom: Spacing[2] },
  escrowNote: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
