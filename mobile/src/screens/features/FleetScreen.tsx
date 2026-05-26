import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Fleet'>;

const FLEET_STATS = [
  { icon: 'car-outline', label: 'Active Drivers', val: '1,840' },
  { icon: 'cube-outline', label: 'Deliveries Today', val: '342' },
  { icon: 'star-outline', label: 'Avg Rating', val: '4.7' },
  { icon: 'checkmark-circle-outline', label: 'On-Time Rate', val: '94%' },
];

const MY_FLEET = [
  { id: 'f1', plate: 'LSD 456 AB', type: 'Mini Truck (3 Tons)', driver: 'Tunde Bakare', status: 'On Delivery', trip: 'Ibadan → Lagos', earnings: 285000 },
  { id: 'f2', plate: 'KJA 112 CD', type: 'Open Truck (5 Tons)', driver: 'Chidi Okonkwo', status: 'Available', trip: null, earnings: 420000 },
];

const AVAILABLE_DRIVERS = [
  { id: 'd1', name: 'Emeka Nwosu', vehicle: 'Mini Truck · 3T', location: 'Oshodi, Lagos', rating: 4.9, trips: 234, available: true },
  { id: 'd2', name: 'Bello Haruna', vehicle: 'Open Truck · 5T', location: 'Kano City', rating: 4.7, trips: 189, available: true },
  { id: 'd3', name: 'Seun Adeyemi', vehicle: 'Refrigerated · 2T', location: 'Ibadan', rating: 4.8, trips: 156, available: false },
  { id: 'd4', name: 'Nkechi Obiora', vehicle: 'Pickup · 1T', location: 'Enugu', rating: 4.6, trips: 98, available: true },
];

export default function FleetScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'analytics'>('overview');

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#E65100', '#F57C00']} style={styles.headerGrad}>
        <Header title="Fleet Management" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          {FLEET_STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={20} color={Colors.white} />
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <View style={styles.tabs}>
        {(['overview', 'drivers', 'analytics'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Vehicle', 'Vehicle registration coming soon.')}>
              <Ionicons name="add" size={16} color={Colors.white} />
              <Text style={styles.addBtnText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
          {MY_FLEET.map(v => (
            <View key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleTop}>
                <View style={styles.vehicleIconBox}>
                  <Ionicons name="car" size={24} color="#F57C00" />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehiclePlate}>{v.plate}</Text>
                  <Text style={styles.vehicleType}>{v.type}</Text>
                  <Text style={styles.vehicleDriver}>Driver: {v.driver}</Text>
                </View>
                <View style={[styles.statusChip, { backgroundColor: v.status === 'On Delivery' ? '#FFF8E1' : '#E8F5E9' }]}>
                  <Text style={[styles.statusText, { color: v.status === 'On Delivery' ? Colors.warning : Colors.success }]}>{v.status}</Text>
                </View>
              </View>
              {v.trip && (
                <View style={styles.tripRow}>
                  <Ionicons name="navigate-outline" size={14} color={Colors.textTertiary} />
                  <Text style={styles.tripText}>{v.trip}</Text>
                </View>
              )}
              <View style={styles.vehicleFooter}>
                <Text style={styles.earningsLabel}>Monthly Earnings</Text>
                <Text style={styles.earningsVal}>{formatCurrency(v.earnings)}</Text>
              </View>
            </View>
          ))}

          <View style={styles.earningsSummary}>
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.earningsCard}>
              <Text style={styles.earningsCardLabel}>Total Fleet Earnings (This Month)</Text>
              <Text style={styles.earningsCardVal}>{formatCurrency(705000)}</Text>
              <View style={styles.earningsRow}>
                <View style={styles.earningItem}>
                  <Text style={styles.earningItemVal}>48</Text>
                  <Text style={styles.earningItemLabel}>Total Trips</Text>
                </View>
                <View style={styles.earningItem}>
                  <Text style={styles.earningItemVal}>12,400 km</Text>
                  <Text style={styles.earningItemLabel}>Distance</Text>
                </View>
                <View style={styles.earningItem}>
                  <Text style={styles.earningItemVal}>96%</Text>
                  <Text style={styles.earningItemLabel}>Completion</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      )}

      {activeTab === 'drivers' && (
        <FlatList
          data={AVAILABLE_DRIVERS}
          keyExtractor={d => d.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>{AVAILABLE_DRIVERS.length} Drivers in Network</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.driverCard}>
              <View style={[styles.driverAvatar, { backgroundColor: item.available ? Colors.primaryTint : Colors.borderLight }]}>
                <Text style={styles.driverInitial}>{item.name[0]}</Text>
                {item.available && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={styles.driverVehicle}>{item.vehicle}</Text>
                <View style={styles.driverMeta}>
                  <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
                  <Text style={styles.driverLocation}>{item.location}</Text>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Text style={styles.driverRating}>{item.rating}</Text>
                  <Text style={styles.driverTrips}>{item.trips} trips</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.hireBtn, !item.available && styles.hireBtnDisabled]}
                disabled={!item.available}
                onPress={() => Alert.alert('Hire', `Hire ${item.name} coming soon.`)}
              >
                <Text style={[styles.hireBtnText, !item.available && { color: Colors.textTertiary }]}>
                  {item.available ? 'Hire' : 'Busy'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'analytics' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          {[
            { label: 'Delivery Success Rate', value: 94, color: Colors.success },
            { label: 'On-Time Delivery', value: 87, color: Colors.primary },
            { label: 'Driver Utilization', value: 72, color: Colors.warning },
            { label: 'Customer Satisfaction', value: 91, color: '#2196F3' },
          ].map((m, i) => (
            <View key={i} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={[styles.metricVal, { color: m.color }]}>{m.value}%</Text>
              </View>
              <View style={styles.metricBar}>
                <View style={[styles.metricFill, { width: `${m.value}%`, backgroundColor: m.color }]} />
              </View>
            </View>
          ))}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Revenue Breakdown</Text>
            {[
              { label: 'Agricultural Goods', pct: 68, amount: 479400 },
              { label: 'Equipment Transport', pct: 22, amount: 155100 },
              { label: 'Express Delivery', pct: 10, amount: 70500 },
            ].map((r, i) => (
              <View key={i} style={styles.revenueRow}>
                <View style={[styles.revenueColor, { backgroundColor: [Colors.primary, Colors.warning, '#2196F3'][i] }]} />
                <Text style={styles.revLabel}>{r.label}</Text>
                <Text style={styles.revPct}>{r.pct}%</Text>
                <Text style={styles.revAmount}>{formatCurrency(r.amount)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  statsRow: { paddingHorizontal: Spacing[4], gap: Spacing[3], paddingVertical: Spacing[2] },
  statCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, padding: Spacing[3], alignItems: 'center', gap: Spacing[1], minWidth: 90 },
  statVal: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.white },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tab: { flex: 1, paddingVertical: Spacing[3], alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#F57C00' },
  tabText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  tabTextActive: { color: '#F57C00' },
  content: { padding: Spacing[4], gap: Spacing[3] },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], backgroundColor: '#F57C00', borderRadius: Radius.lg, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2] },
  addBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.white },
  vehicleCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  vehicleTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  vehicleIconBox: { width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  vehicleInfo: { flex: 1 },
  vehiclePlate: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  vehicleType: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 1 },
  vehicleDriver: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 1 },
  statusChip: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full },
  statusText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  tripText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  vehicleFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing[3], borderTopWidth: 1, borderTopColor: Colors.borderLight },
  earningsLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  earningsVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.success },
  earningsSummary: { borderRadius: Radius.xl, overflow: 'hidden' },
  earningsCard: { padding: Spacing[5] },
  earningsCardLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  earningsCardVal: { fontFamily: FontFamily.bold, fontSize: 32, color: Colors.white, marginVertical: Spacing[2] },
  earningsRow: { flexDirection: 'row', gap: Spacing[4] },
  earningItem: {},
  earningItemVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white },
  earningItemLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  driverInitial: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.primary },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.white },
  driverInfo: { flex: 1 },
  driverName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  driverVehicle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  driverMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], marginTop: 2 },
  driverLocation: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, flex: 1 },
  driverRating: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary },
  driverTrips: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  hireBtn: { backgroundColor: '#F57C00', borderRadius: Radius.lg, paddingHorizontal: Spacing[4], paddingVertical: Spacing[2] },
  hireBtnDisabled: { backgroundColor: Colors.borderLight },
  hireBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  metricCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[2] },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  metricLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  metricVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  metricBar: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  metricFill: { height: '100%', borderRadius: 4 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  revenueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], paddingVertical: Spacing[2] },
  revenueColor: { width: 12, height: 12, borderRadius: 6 },
  revLabel: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  revPct: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary, width: 36 },
  revAmount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, width: 90, textAlign: 'right' },
});
