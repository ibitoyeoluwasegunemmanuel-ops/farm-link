import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius, Shadow } from '../../constants/spacing';
import { Header, Button } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'LogisticsHome'>;

const ACTIVE_DELIVERIES = [
  { id: 'DEL001', from: 'Lagos', to: 'Abuja', status: 'in_transit', eta: '2h 15m', driver: 'Ibrahim M.' },
];

const QUICK_STATS = [
  { label: 'Active Deliveries', value: '2', icon: 'cube', color: Colors.primary },
  { label: 'Completed', value: '18', icon: 'checkmark-circle', color: Colors.success },
  { label: 'Total Spent', value: '₦245K', icon: 'wallet', color: '#9C27B0' },
];

export default function LogisticsScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Logistics" subtitle="Move your produce safely" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero CTA */}
        <LinearGradient colors={[Colors.primary, Colors.primaryMedium]} style={styles.heroBanner}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Move Your Harvest</Text>
            <Text style={styles.heroSub}>Trusted drivers across Nigeria</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('BookTruck')}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.bookBtnText}>Book Truck</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {QUICK_STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Active deliveries */}
        {ACTIVE_DELIVERIES.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Deliveries</Text>
            {ACTIVE_DELIVERIES.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.deliveryCard}
                onPress={() => navigation.navigate('LiveTracking', { bookingId: d.id })}
              >
                <View style={styles.deliveryRoute}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.primary }]} />
                    <Text style={styles.routeCity}>{d.from}</Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
                    <Text style={styles.routeCity}>{d.to}</Text>
                  </View>
                </View>
                <View style={styles.deliveryInfo}>
                  <View style={styles.driverRow}>
                    <Ionicons name="person-circle-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.driverName}>{d.driver}</Text>
                  </View>
                  <View style={styles.etaRow}>
                    <Ionicons name="time-outline" size={14} color={Colors.primary} />
                    <Text style={styles.eta}>ETA: {d.eta}</Text>
                  </View>
                </View>
                <View style={styles.trackBtn}>
                  <Ionicons name="location" size={16} color={Colors.white} />
                  <Text style={styles.trackBtnText}>Track</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Features */}
        <Text style={styles.sectionTitle}>Why FarmLink Logistics?</Text>
        {[
          { icon: 'shield-checkmark-outline', title: 'Insured Deliveries', desc: 'All deliveries are insured up to ₦5M' },
          { icon: 'location-outline', title: 'Real-time Tracking', desc: 'Track your shipment live on the map' },
          { icon: 'people-outline', title: 'Verified Drivers', desc: 'Background-checked, certified drivers' },
          { icon: 'cash-outline', title: 'Pay After Delivery', desc: 'Funds held in escrow until you confirm' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon as any} size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.fab}>
        <Button label="Book a Truck" onPress={() => navigation.navigate('BookTruck')} size="lg" variant="gradient" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4], paddingBottom: 100 },
  heroBanner: { borderRadius: Radius.xl, padding: Spacing[5], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing[4] },
  heroText: {},
  heroTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  heroSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.white, borderRadius: Radius.full, paddingHorizontal: Spacing[4], paddingVertical: Spacing[2] },
  bookBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primary },
  statsRow: { flexDirection: 'row', gap: Spacing[3], marginBottom: Spacing[4] },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[3], alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[2] },
  statValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  statLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3], marginTop: Spacing[2] },
  deliveryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.border, gap: Spacing[3] },
  deliveryRoute: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeCity: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  routeLine: { flex: 1, height: 1, backgroundColor: Colors.border, borderStyle: 'dashed' },
  deliveryInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverName: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eta: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primary },
  trackBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], alignSelf: 'flex-start' },
  trackBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.white },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], marginBottom: Spacing[4] },
  featureIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  featureInfo: {},
  featureTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  featureDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  fab: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing[4], paddingBottom: Spacing[6], backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
});
