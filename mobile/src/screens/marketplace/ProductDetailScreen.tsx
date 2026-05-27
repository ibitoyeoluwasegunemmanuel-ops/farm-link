import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button, Avatar } from '../../components/common';
import { formatCurrency } from '../../constants/theme';
import { useCartStore } from '../../store/cartStore';
import { harvestService, Harvest } from '../../services/harvestService';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'ProductDetail'>;

const FALLBACK: Harvest = {
  id: '', farmerId: 'farmer1', cropType: 'White Maize', quantity: 200, unit: 'bag (100kg)',
  pricePerUnit: 55000, totalPrice: 0, quality: 'Grade A', status: 'available',
  description: 'Premium grade white maize, freshly harvested from our certified organic farm.',
  location: { state: 'Lagos', town: 'Ikorodu' },
  farmer: { id: 'farmer1', fullName: 'Emeka Okafor', farmName: 'Green Oasis Farm', rating: 4.8 },
};

export default function ProductDetailScreen({ navigation, route }: Props) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [harvest, setHarvest] = useState<Harvest>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    harvestService.getListing(route.params.productId)
      .then((res) => setHarvest(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [route.params.productId]);

  const product = {
    id: harvest.id || route.params.productId,
    name: harvest.cropType,
    price: harvest.pricePerUnit,
    unit: harvest.unit,
    quantity: harvest.quantity,
    farmerName: harvest.farmer?.fullName || 'Farmer',
    farmName: harvest.farmer?.farmName || '',
    location: `${harvest.location?.town || ''}, ${harvest.location?.state || ''}`.replace(/^, |, $/, ''),
    verified: !!harvest.farmer,
    rating: harvest.farmer?.rating || 4.5,
    totalSales: harvest.views || 0,
    description: harvest.description || '',
    quality: harvest.quality || 'Grade A',
    harvestDate: harvest.harvestDate ? new Date(harvest.harvestDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' }) : '',
    moq: 1,
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      imageUri: undefined,
      farmerName: product.farmerName,
      farmerId: harvest.farmerId,
      maxQuantity: product.quantity,
    });
    Alert.alert('Added to Cart', `${qty} × ${product.name} added.`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate('Checkout');
  };

  if (loading) {
    return (
      <View style={[styles.flex, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {/* Back button over image */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={Colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wishBtn}
        onPress={() => setWishlisted((w) => !w)}
      >
        <Ionicons
          name={wishlisted ? 'heart' : 'heart-outline'}
          size={22}
          color={wishlisted ? Colors.error : Colors.white}
        />
      </TouchableOpacity>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrap}>
          <LinearGradient
            colors={[Colors.primaryTint, Colors.primaryLight + '40']}
            style={styles.imagePlaceholder}
          >
            <Ionicons name="leaf" size={64} color={Colors.primary} />
          </LinearGradient>
        </View>

        <View style={styles.body}>
          {/* Name & price */}
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.qualityRow}>
                <View style={styles.qualityBadge}>
                  <Text style={styles.qualityText}>{product.quality}</Text>
                </View>
                <Text style={styles.harvest}>Harvested {product.harvestDate}</Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
              <Text style={styles.unit}>per {product.unit}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{product.rating}</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.stat}>
              <Ionicons name="checkmark-done-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.statText}>{product.totalSales} sold</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.stat}>
              <Ionicons name="cube-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.statText}>{product.quantity} bags left</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* Farmer card */}
          <View style={styles.farmerCard}>
            <Avatar name={product.farmerName} size="md" verified={product.verified} />
            <View style={styles.farmerInfo}>
              <View style={styles.farmerNameRow}>
                <Text style={styles.farmerName}>{product.farmerName}</Text>
                {product.verified && <Ionicons name="checkmark-circle" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />}
              </View>
              <Text style={styles.farmName}>{product.farmName}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
                <Text style={styles.location}>{product.location}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.msgBtn}
              onPress={() => navigation.getParent()?.navigate('Home', { screen: 'Chat', params: { userId: 'farmer1', userName: product.farmerName } })}
            >
              <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Quantity selector */}
          <View style={styles.qtySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, qty <= product.moq && styles.qtyBtnDisabled]}
                onPress={() => setQty((q) => Math.max(product.moq, q - 1))}
              >
                <Ionicons name="remove" size={20} color={qty <= product.moq ? Colors.textTertiary : Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, qty >= product.quantity && styles.qtyBtnDisabled]}
                onPress={() => setQty((q) => Math.min(product.quantity, q + 1))}
              >
                <Ionicons name="add" size={20} color={qty >= product.quantity ? Colors.textTertiary : Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.subtotal}>{formatCurrency(product.price * qty)} total</Text>
            </View>
          </View>

          {/* Escrow info */}
          <View style={styles.escrowBanner}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
            <Text style={styles.escrowText}>
              Payment is held in escrow. Funds released to farmer only after you confirm delivery.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={22} color={Colors.primary} />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <Button label="Buy Now" onPress={handleBuyNow} size="lg" style={styles.buyBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishBtn: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: { height: 280 },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: Spacing[4], paddingBottom: 100 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing[3] },
  titleInfo: { flex: 1, marginRight: Spacing[4] },
  productName: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[2] },
  qualityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  qualityBadge: { backgroundColor: Colors.success + '20', borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  qualityText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.success },
  harvest: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.primary },
  unit: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[4] },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[2], marginTop: Spacing[4] },
  desc: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginTop: Spacing[4],
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  farmerInfo: { flex: 1 },
  farmerNameRow: { flexDirection: 'row', alignItems: 'center' },
  farmerName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  farmName: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  location: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  msgBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtySection: { marginTop: Spacing[4] },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary, minWidth: 32, textAlign: 'center' },
  subtotal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary, marginLeft: Spacing[4] },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginTop: Spacing[4],
  },
  escrowText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    paddingBottom: Spacing[6],
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  cartBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primary },
  buyBtn: { flex: 1 },
});
