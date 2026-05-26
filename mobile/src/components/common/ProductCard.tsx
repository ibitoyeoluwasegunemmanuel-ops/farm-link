import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/spacing';
import { formatCurrency } from '../../constants/theme';
import { VerifiedBadge } from './Badge';

const CARD_WIDTH = (Dimensions.get('window').width - Spacing[4] * 2 - Spacing[3]) / 2;

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity?: number;
  imageUri?: string;
  farmerName?: string;
  location?: string;
  verified?: boolean;
  isWishlisted?: boolean;
  onPress?: () => void;
  onWishlist?: () => void;
  style?: ViewStyle;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  unit,
  quantity,
  imageUri,
  farmerName,
  location,
  verified = false,
  isWishlisted = false,
  onPress,
  onWishlist,
  style,
  horizontal = false,
}) => {
  if (horizontal) {
    return (
      <TouchableOpacity
        style={[styles.hCard, style]}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.hImageWrap}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.hImage} />
          ) : (
            <View style={styles.hImagePlaceholder}>
              <Ionicons name="leaf" size={24} color={Colors.primary} />
            </View>
          )}
        </View>
        <View style={styles.hContent}>
          <Text style={styles.hName} numberOfLines={2}>{name}</Text>
          <Text style={styles.hPrice}>{formatCurrency(price)}<Text style={styles.hUnit}>/{unit}</Text></Text>
          {farmerName && (
            <View style={styles.hFarmerRow}>
              {verified && <Ionicons name="checkmark-circle" size={12} color={Colors.primary} style={{ marginRight: 3 }} />}
              <Text style={styles.hFarmer} numberOfLines={1}>{farmerName}</Text>
            </View>
          )}
          {location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color={Colors.textTertiary} />
              <Text style={styles.location} numberOfLines={1}>{location}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="leaf" size={32} color={Colors.primary} />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.15)']}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Wishlist */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={onWishlist}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? Colors.error : Colors.white}
          />
        </TouchableOpacity>
        {/* Verified badge on image */}
        {verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(price)}</Text>
          <Text style={styles.unit}>/{unit}</Text>
        </View>
        {farmerName && (
          <Text style={styles.farmer} numberOfLines={1}>{farmerName}</Text>
        )}
        {location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color={Colors.textTertiary} />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
        )}
        {quantity !== undefined && (
          <Text style={styles.quantity}>{quantity} bags available</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...(Shadow.sm as any),
    marginBottom: Spacing[3],
  },
  imageWrap: {
    width: '100%',
    height: CARD_WIDTH * 0.85,
    backgroundColor: Colors.primaryTint,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  wishlistBtn: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: Spacing[2],
    left: Spacing[2],
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 1,
  },
  content: {
    padding: Spacing[3],
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  unit: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  farmer: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  location: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    flex: 1,
  },
  quantity: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },

  // Horizontal card
  hCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...(Shadow.sm as any),
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  hImageWrap: {
    width: 90,
    height: 90,
    backgroundColor: Colors.primaryTint,
  },
  hImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  hImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hContent: { flex: 1, padding: Spacing[3] },
  hName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  hPrice: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primary,
    marginBottom: 4,
  },
  hUnit: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  hFarmerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  hFarmer: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
});
