import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, Header, Input } from '../../components/common';
import { formatCurrency } from '../../constants/theme';
import { useCartStore } from '../../store/cartStore';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
  const { totalPrice, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos');
  const [payMethod, setPayMethod] = useState<'wallet' | 'card' | 'transfer'>('wallet');
  const [loading, setLoading] = useState(false);

  const platformFee = totalPrice * 0.02;
  const delivery = 8500;
  const total = totalPrice + platformFee + delivery;

  const handlePlaceOrder = async () => {
    if (!address.trim() || !city.trim()) {
      Alert.alert('Required', 'Please fill in your delivery address.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      clearCart();
      navigation.replace('OrderSuccess', { orderId: `ORD${Date.now()}` });
    } catch {
      Alert.alert('Error', 'Could not place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <Header title="Checkout" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Delivery */}
        <Text style={styles.section}>Delivery Address</Text>
        <Input label="Street Address" placeholder="e.g. 12 Adeola Street" value={address} onChangeText={setAddress} required />
        <View style={styles.cityRow}>
          <View style={styles.cityInput}>
            <Input label="City" placeholder="e.g. Ikeja" value={city} onChangeText={setCity} required />
          </View>
          <View style={styles.stateInput}>
            <Input label="State" value={state} onChangeText={setState} />
          </View>
        </View>

        {/* Payment method */}
        <Text style={styles.section}>Payment Method</Text>
        {([
          { key: 'wallet', icon: 'wallet-outline', label: 'FarmLink Wallet', sub: 'Balance: ₦45,200' },
          { key: 'card', icon: 'card-outline', label: 'Debit/Credit Card', sub: 'Visa, Mastercard, Verve' },
          { key: 'transfer', icon: 'swap-horizontal-outline', label: 'Bank Transfer', sub: 'Direct transfer' },
        ] as const).map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.payOption, payMethod === m.key && styles.payOptionActive]}
            onPress={() => setPayMethod(m.key)}
          >
            <View style={[styles.payIcon, { backgroundColor: payMethod === m.key ? Colors.primaryTint : Colors.inputBg }]}>
              <Ionicons name={m.icon} size={20} color={payMethod === m.key ? Colors.primary : Colors.textSecondary} />
            </View>
            <View style={styles.payInfo}>
              <Text style={[styles.payLabel, payMethod === m.key && { color: Colors.primary }]}>{m.label}</Text>
              <Text style={styles.paySub}>{m.sub}</Text>
            </View>
            <View style={[styles.radio, payMethod === m.key && styles.radioActive]}>
              {payMethod === m.key && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Subtotal</Text><Text style={styles.sumVal}>{formatCurrency(totalPrice)}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Platform fee (2%)</Text><Text style={styles.sumVal}>{formatCurrency(platformFee)}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Delivery</Text><Text style={styles.sumVal}>{formatCurrency(delivery)}</Text></View>
          <View style={[styles.sumRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.escrowNote}>
          <Ionicons name="lock-closed" size={16} color={Colors.primary} />
          <Text style={styles.escrowText}>Your payment is held in escrow until you confirm delivery receipt.</Text>
        </View>

        <Button
          label={`Place Order · ${formatCurrency(total)}`}
          onPress={handlePlaceOrder}
          loading={loading}
          size="lg"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4], paddingBottom: 40 },
  section: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3], marginTop: Spacing[2] },
  cityRow: { flexDirection: 'row', gap: Spacing[3] },
  cityInput: { flex: 2 },
  stateInput: { flex: 1 },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[2],
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  payOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryTint },
  payIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  payInfo: { flex: 1 },
  payLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  paySub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginTop: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing[2] },
  sumLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  sumVal: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing[3], marginTop: Spacing[2], marginBottom: 0 },
  totalLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.textPrimary },
  totalVal: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.primary },
  escrowNote: { flexDirection: 'row', gap: Spacing[2], alignItems: 'flex-start', backgroundColor: Colors.primaryTint, borderRadius: Radius.md, padding: Spacing[3], marginBottom: Spacing[4] },
  escrowText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textPrimary, flex: 1, lineHeight: 18 },
});
