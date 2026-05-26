import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, Header, EmptyState } from '../../components/common';
import { formatCurrency } from '../../constants/theme';
import { useCartStore } from '../../store/cartStore';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCartStore();

  const PLATFORM_FEE = totalPrice * 0.02;
  const DELIVERY_EST = 8500;
  const GRAND_TOTAL = totalPrice + PLATFORM_FEE + DELIVERY_EST;

  if (items.length === 0) {
    return (
      <View style={styles.flex}>
        <Header title="Cart" showBack onBack={() => navigation.goBack()} />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          description="Browse the marketplace and add products to your cart."
          actionLabel="Browse Marketplace"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Header title={`Cart (${totalItems})`} showBack onBack={() => navigation.goBack()} />

      <FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemImage}>
              <Ionicons name="leaf" size={24} color={Colors.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}/{item.unit}</Text>
              <Text style={styles.itemFarmer}>{item.farmerName}</Text>
            </View>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeItem(item.productId)}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform fee (2%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(PLATFORM_FEE)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated delivery</Text>
              <Text style={styles.summaryValue}>{formatCurrency(DELIVERY_EST)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(GRAND_TOTAL)}</Text>
            </View>

            <View style={styles.escrowBanner}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.escrowText}>Secured by FarmLink Escrow — payment held until delivery confirmed.</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <Button
          label={`Proceed to Checkout · ${formatCurrency(GRAND_TOTAL)}`}
          onPress={() => navigation.navigate('Checkout')}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing[4], paddingBottom: 100 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: 2 },
  itemPrice: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary, marginBottom: 2 },
  itemFarmer: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  summary: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginTop: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing[2] },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryValue: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing[3], marginTop: Spacing[2] },
  totalLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.textPrimary },
  totalValue: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.primary },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.md,
    padding: Spacing[3],
    marginTop: Spacing[4],
  },
  escrowText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textPrimary, flex: 1, lineHeight: 18 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[4],
    paddingBottom: Spacing[6],
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
