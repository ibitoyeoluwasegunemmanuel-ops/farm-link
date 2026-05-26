import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';
import { formatCurrency } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'DriverDashboard'>;

const AVAILABLE_TRIPS = [
  { id: 't1', from: 'Bodija Market, Ibadan', to: 'Mile 12, Lagos', cargo: 'Tomatoes (500kg)', pay: 45000, distance: '128 km', time: '2h 30min' },
  { id: 't2', from: 'Kano Central Market', to: 'Abuja (Wuse)', cargo: 'Grains (2 tonnes)', pay: 85000, distance: '310 km', time: '4h 45min' },
  { id: 't3', from: 'Ogoja, Cross River', to: 'Port Harcourt', cargo: 'Cassava (1 tonne)', pay: 32000, distance: '95 km', time: '1h 50min' },
];

const RECENT_TRIPS = [
  { id: 'r1', route: 'Ibadan → Lagos', cargo: 'Tomatoes', earnings: 45000, date: 'Today', rating: 5 },
  { id: 'r2', route: 'Kano → Abuja', cargo: 'Maize', earnings: 80000, date: 'Yesterday', rating: 4 },
  { id: 'r3', route: 'Enugu → Onitsha', cargo: 'Yam', earnings: 28000, date: 'Dec 10', rating: 5 },
];

export default function DriverDashboardScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);
  const [isOnline, setIsOnline] = useState(true);

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#E65100', '#F57C00']} style={styles.headerGrad}>
        <Header title="Driver Dashboard" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.statusRow}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverGreet}>Welcome back,</Text>
            <Text style={styles.driverName}>{user?.fullName || 'Driver'} 🚛</Text>
          </View>
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineLabel, { color: isOnline ? '#A5D6A7' : 'rgba(255,255,255,0.5)' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.success }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.earningsCard}>
          {[
            { label: "Today's Earnings", val: formatCurrency(45000) },
            { label: 'This Week', val: formatCurrency(245000) },
            { label: 'Rating', val: '4.9 ⭐' },
          ].map((e, i) => (
            <View key={i} style={[styles.earningItem, i !== 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.earningLabel}>{e.label}</Text>
              <Text style={styles.earningVal}>{e.val}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {[
            { icon: 'car-outline', label: 'Trips Today', val: '3' },
            { icon: 'navigate-outline', label: 'Km Today', val: '342' },
            { icon: 'time-outline', label: 'Hours Active', val: '7.5' },
            { icon: 'checkmark-circle-outline', label: 'Completion', val: '97%' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {isOnline ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Trips ({AVAILABLE_TRIPS.length})</Text>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            {AVAILABLE_TRIPS.map(t => (
              <View key={t.id} style={styles.tripCard}>
                <View style={styles.tripRoute}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                    <Text style={styles.routeText}>{t.from}</Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
                    <Text style={styles.routeText}>{t.to}</Text>
                  </View>
                </View>
                <View style={styles.tripMeta}>
                  <View style={styles.tripMetaItem}>
                    <Ionicons name="cube-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.tripMetaText}>{t.cargo}</Text>
                  </View>
                  <View style={styles.tripMetaItem}>
                    <Ionicons name="navigate-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.tripMetaText}>{t.distance}</Text>
                  </View>
                  <View style={styles.tripMetaItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.tripMetaText}>{t.time}</Text>
                  </View>
                </View>
                <View style={styles.tripFooter}>
                  <Text style={styles.tripPay}>{formatCurrency(t.pay)}</Text>
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Text style={styles.acceptBtnText}>Accept Trip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.offlineCard}>
            <Ionicons name="moon-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.offlineTitle}>You're Offline</Text>
            <Text style={styles.offlineSub}>Go online to see available trips in your area</Text>
            <TouchableOpacity style={styles.goOnlineBtn} onPress={() => setIsOnline(true)}>
              <Text style={styles.goOnlineBtnText}>Go Online</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {RECENT_TRIPS.map(t => (
            <View key={t.id} style={styles.recentRow}>
              <View style={styles.recentIcon}>
                <Ionicons name="car" size={18} color="#F57C00" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentRoute}>{t.route}</Text>
                <Text style={styles.recentCargo}>{t.cargo} · {t.date}</Text>
              </View>
              <View style={styles.recentRight}>
                <Text style={styles.recentEarnings}>{formatCurrency(t.earnings)}</Text>
                <View style={styles.recentRating}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={10} color="#FFC107" />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <Text style={styles.sectionTitle}>My Vehicle</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={16} color={Colors.primary} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleIconBox}><Ionicons name="car" size={28} color="#F57C00" /></View>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>Toyota Hilux (Mini Truck)</Text>
              <Text style={styles.vehiclePlate}>LSD 456 AB · 3 Tons Capacity</Text>
              <View style={styles.vehicleStatus}>
                <View style={styles.greenDot} />
                <Text style={styles.vehicleStatusText}>Roadworthy · Insurance valid till Mar 2025</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[4], marginBottom: Spacing[3] },
  driverInfo: {},
  driverGreet: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  driverName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  onlineToggle: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  onlineLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  earningsCard: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden' },
  earningItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing[4] },
  earningLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  earningVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white, marginTop: 4 },
  content: { padding: Spacing[4], gap: Spacing[4] },
  statsRow: { flexDirection: 'row', gap: Spacing[3] },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[3], alignItems: 'center', gap: Spacing[1], borderWidth: 1, borderColor: Colors.borderLight },
  statVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  statLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  section: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  seeAll: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], backgroundColor: '#E8F5E9', borderRadius: Radius.full, paddingHorizontal: Spacing[2], paddingVertical: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontFamily: FontFamily.medium, fontSize: 10, color: Colors.success },
  tripCard: { backgroundColor: Colors.background, borderRadius: Radius.lg, padding: Spacing[3], gap: Spacing[3] },
  tripRoute: { gap: Spacing[2] },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1 },
  routeLine: { width: 2, height: 12, backgroundColor: Colors.borderLight, marginLeft: 4 },
  tripMeta: { flexDirection: 'row', gap: Spacing[4] },
  tripMetaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  tripMetaText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  tripFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing[2], borderTopWidth: 1, borderTopColor: Colors.borderLight },
  tripPay: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.success },
  acceptBtn: { backgroundColor: '#F57C00', borderRadius: Radius.lg, paddingHorizontal: Spacing[5], paddingVertical: Spacing[3] },
  acceptBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  offlineCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[8], alignItems: 'center', gap: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  offlineTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl, color: Colors.textPrimary },
  offlineSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  goOnlineBtn: { backgroundColor: '#F57C00', borderRadius: Radius.lg, paddingHorizontal: Spacing[6], paddingVertical: Spacing[3] },
  goOnlineBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  recentIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  recentInfo: { flex: 1 },
  recentRoute: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  recentCargo: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  recentRight: { alignItems: 'flex-end', gap: 4 },
  recentEarnings: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.success },
  recentRating: { flexDirection: 'row', gap: 1 },
  vehicleCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  vehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  editBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  vehicleInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  vehicleIconBox: { width: 56, height: 56, borderRadius: Radius.lg, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  vehicleDetails: { flex: 1, gap: Spacing[1] },
  vehicleName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  vehiclePlate: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  vehicleStatus: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  vehicleStatusText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
});
