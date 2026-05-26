import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Avatar, Button } from '../../components/common';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'LiveTracking'>;

export default function LiveTrackingScreen({ navigation, route }: Props) {
  const [status] = useState<'picking_up' | 'in_transit' | 'arriving'>('in_transit');

  const STATUS_CONFIG = {
    picking_up: { label: 'Driver Picking Up Cargo', icon: 'cube-outline', color: '#FF9800' },
    in_transit: { label: 'In Transit', icon: 'car-outline', color: Colors.primary },
    arriving: { label: 'Almost There!', icon: 'location', color: Colors.success },
  };

  const cfg = STATUS_CONFIG[status];

  return (
    <View style={styles.flex}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Map placeholder */}
      <View style={styles.mapArea}>
        <Ionicons name="map" size={64} color={Colors.border} />
        <Text style={styles.mapText}>Live map — GPS tracking</Text>
        <Text style={styles.mapSub}>google-maps integration here</Text>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        {/* Status pill */}
        <View style={[styles.statusPill, { backgroundColor: cfg.color + '20' }]}>
          <Ionicons name={cfg.icon as any} size={16} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>

        {/* ETA */}
        <View style={styles.etaRow}>
          <View>
            <Text style={styles.etaLabel}>Estimated Arrival</Text>
            <Text style={styles.etaTime}>2h 15min</Text>
          </View>
          <View>
            <Text style={styles.etaLabel}>Distance Left</Text>
            <Text style={styles.etaTime}>142 km</Text>
          </View>
          <View>
            <Text style={styles.etaLabel}>Booking</Text>
            <Text style={styles.etaTime}>#{route.params.bookingId.slice(-6)}</Text>
          </View>
        </View>

        {/* Driver info */}
        <View style={styles.driverCard}>
          <Avatar name="Ibrahim Musa" size="md" online />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ibrahim Musa</Text>
            <View style={styles.plateRow}>
              <Text style={styles.plate}>AGL-234-XY</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.msgBtn}>
            <Ionicons name="chatbubble" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Button
          label="Confirm Delivery Received"
          onPress={() => navigation.replace('DeliveryCompleted', { bookingId: route.params.bookingId })}
          size="lg"
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.inputBg },
  closeBtn: { position: 'absolute', top: 52, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  mapArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing[2] },
  mapText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textSecondary },
  mapSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing[5], paddingBottom: Spacing[8], gap: Spacing[4], shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2] },
  statusText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  etaLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 3 },
  etaTime: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.inputBg, borderRadius: Radius.lg, padding: Spacing[4] },
  driverInfo: { flex: 1 },
  driverName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginTop: 3 },
  plate: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  msgBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
});
