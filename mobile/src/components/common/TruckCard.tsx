import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/spacing';
import { formatCurrency } from '../../constants/theme';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface TruckCardProps {
  id: string;
  driverName: string;
  driverAvatar?: string;
  vehicleType: string;
  plateNumber: string;
  capacity: number;
  capacityUnit?: string;
  rating?: number;
  totalTrips?: number;
  distanceKm?: number;
  estimatedPrice?: number;
  isAvailable?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  onSelect?: () => void;
  style?: ViewStyle;
}

export const TruckCard: React.FC<TruckCardProps> = ({
  driverName,
  driverAvatar,
  vehicleType,
  plateNumber,
  capacity,
  capacityUnit = 'tons',
  rating = 0,
  totalTrips = 0,
  distanceKm,
  estimatedPrice,
  isAvailable = true,
  isSelected = false,
  onPress,
  onSelect,
  style,
}) => {
  const vehicleIconMap: Record<string, string> = {
    pickup: 'car-outline',
    minivan: 'car-sport-outline',
    truck_3t: 'bus-outline',
    truck_10t: 'bus-outline',
    truck_20t: 'train-outline',
    refrigerated: 'snow-outline',
  };

  const vehicleLabelMap: Record<string, string> = {
    pickup: 'Pickup (1T)',
    minivan: 'Mini Van (2T)',
    truck_3t: 'Truck (3T)',
    truck_10t: 'Truck (10T)',
    truck_20t: 'Truck (20T)',
    refrigerated: 'Refrigerated',
  };

  const icon = vehicleIconMap[vehicleType] || 'car-outline';
  const vehicleLabel = vehicleLabelMap[vehicleType] || vehicleType;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        !isAvailable && styles.cardUnavailable,
        style,
      ]}
      onPress={onPress || onSelect}
      activeOpacity={0.9}
    >
      {/* Vehicle icon */}
      <View style={[styles.vehicleIcon, isSelected && styles.vehicleIconSelected]}>
        <Ionicons
          name={icon as any}
          size={28}
          color={isSelected ? Colors.white : Colors.primary}
        />
      </View>

      {/* Main info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.vehicleType}>{vehicleLabel}</Text>
          {!isAvailable && (
            <Badge label="Unavailable" variant="neutral" size="sm" />
          )}
          {isAvailable && isSelected && (
            <Badge label="Selected" variant="success" size="sm" />
          )}
        </View>

        {/* Driver row */}
        <View style={styles.driverRow}>
          <Avatar uri={driverAvatar} name={driverName} size="xs" />
          <Text style={styles.driverName} numberOfLines={1}>{driverName}</Text>
          <Text style={styles.plateNum}>{plateNumber}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.statText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.stat}>
            <Ionicons name="checkmark-done-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.statText}>{totalTrips} trips</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.stat}>
            <Ionicons name="cube-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.statText}>{capacity} {capacityUnit}</Text>
          </View>
          {distanceKm !== undefined && (
            <>
              <View style={styles.statDot} />
              <View style={styles.stat}>
                <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.statText}>{distanceKm.toFixed(1)}km</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Price */}
      {estimatedPrice !== undefined && (
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Est.</Text>
          <Text style={[styles.price, isSelected && styles.priceSelected]}>
            {formatCurrency(estimatedPrice)}
          </Text>
        </View>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...(Shadow.sm as any),
    gap: Spacing[3],
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  cardUnavailable: {
    opacity: 0.55,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIconSelected: {
    backgroundColor: Colors.primary,
  },
  info: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  vehicleType: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  driverName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  plateNum: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    backgroundColor: Colors.borderLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.border,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  priceSelected: { color: Colors.primary },
  checkmark: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
  },
});
