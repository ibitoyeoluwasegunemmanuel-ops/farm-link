import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

type Props = NativeStackScreenProps<HomeStackParamList, 'FarmerDashboard'>;

const QUICK_ACTIONS = [
  { icon: 'add-circle-outline', label: 'Add Listing', color: Colors.primary },
  { icon: 'analytics-outline', label: 'View Sales', color: '#2196F3' },
  { icon: 'leaf-outline', label: 'Crop Scanner', color: Colors.success },
  { icon: 'cloud-outline', label: 'Weather', color: '#FF9800' },
];

const MY_LISTINGS = [
  { id: '1', name: 'Fresh Tomatoes', qty: '500 kg', price: 280000, sold: 30, status: 'Active' },
  { id: '2', name: 'White Maize', qty: '2 tonnes', price: 760000, sold: 60, status: 'Active' },
  { id: '3', name: 'Cassava Tubers', qty: '1 tonne', price: 85000, sold: 100, status: 'Sold Out' },
];

const RECENT_ORDERS = [
  { id: 'o1', buyer: 'Foodco Supermarket', product: 'Tomatoes × 200kg', amount: 112000, status: 'Processing' },
  { id: 'o2', buyer: 'Ahmed Traders', product: 'Maize × 1 tonne', amount: 380000, status: 'Delivered' },
];

export default function FarmerDashboardScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.headerGrad}>
        <Header title="Farmer Dashboard" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeText}>Good morning,</Text>
            <Text style={styles.farmName}>{user?.farmName || user?.fullName || 'Farmer'} 👋</Text>
          </View>
          <View style={styles.seasonBadge}>
            <Ionicons name="leaf" size={14} color={Colors.white} />
            <Text style={styles.seasonText}>Rainy Season</Text>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <View style={styles.earningItem}>
            <Text style={styles.earningLabel}>This Month</Text>
            <Text style={styles.earningVal}>{formatCurrency(1245000)}</Text>
          </View>
          <View style={[styles.earningItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.earningLabel}>In Escrow</Text>
            <Text style={styles.earningVal}>{formatCurrency(380000)}</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningLabel}>Pending</Text>
            <Text style={styles.earningVal}>{formatCurrency(112000)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={styles.quickAction}>
              <View style={[styles.qaIcon, { backgroundColor: a.color + '20' }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.alertCard}>
          <Ionicons name="warning" size={18} color={Colors.warning} />
          <Text style={styles.alertText}>Heavy rain forecast Wed–Thu. Consider early harvest for ripe tomatoes.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {MY_LISTINGS.map(l => (
            <View key={l.id} style={styles.listingRow}>
              <View style={styles.listingInfo}>
                <Text style={styles.listingName}>{l.name}</Text>
                <Text style={styles.listingQty}>{l.qty}</Text>
              </View>
              <View style={styles.listingMid}>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressFillSmall, { width: `${l.sold}%`, backgroundColor: l.sold === 100 ? Colors.textTertiary : Colors.primary }]} />
                </View>
                <Text style={styles.soldPct}>{l.sold}% sold</Text>
              </View>
              <Text style={styles.listingPrice}>{formatCurrency(l.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {RECENT_ORDERS.map(o => (
            <View key={o.id} style={styles.orderRow}>
              <View style={styles.orderAvatar}><Text style={styles.orderAvatarText}>{o.buyer[0]}</Text></View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderBuyer}>{o.buyer}</Text>
                <Text style={styles.orderProduct}>{o.product}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>{formatCurrency(o.amount)}</Text>
                <View style={[styles.orderStatus, { backgroundColor: o.status === 'Delivered' ? '#E8F5E9' : '#FFF8E1' }]}>
                  <Text style={[styles.orderStatusText, { color: o.status === 'Delivered' ? Colors.success : Colors.warning }]}>{o.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Advisory</Text>
          <View style={styles.advisoryCard}>
            <Ionicons name="leaf" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.advisoryTitle}>Fertilizer Application Window</Text>
              <Text style={styles.advisoryText}>Optimal time to apply top-dressing nitrogen fertilizer is this week before expected rainfall on Wednesday.</Text>
            </View>
          </View>
          <View style={styles.advisoryCard}>
            <Ionicons name="trending-up" size={20} color={Colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.advisoryTitle}>Tomato Prices Rising</Text>
              <Text style={styles.advisoryText}>Tomato prices up 12% this week at Mile 12 market. Good time to sell stored produce.</Text>
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
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[4], marginBottom: Spacing[3] },
  welcomeText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  farmName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  seasonBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1] },
  seasonText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.white },
  earningsCard: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden' },
  earningItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing[4] },
  earningLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  earningVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white, marginTop: 4 },
  content: { padding: Spacing[4], gap: Spacing[4] },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: Spacing[2] },
  qaIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  alertCard: { flexDirection: 'row', gap: Spacing[3], backgroundColor: '#FFF8E1', borderRadius: Radius.lg, padding: Spacing[3], borderLeftWidth: 3, borderLeftColor: Colors.warning },
  alertText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  section: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  seeAll: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  listingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  listingInfo: { flex: 1 },
  listingName: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  listingQty: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  listingMid: { flex: 1, gap: 4 },
  progressBarSmall: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, overflow: 'hidden' },
  progressFillSmall: { height: '100%', borderRadius: 2 },
  soldPct: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  listingPrice: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  orderAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  orderAvatarText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm, color: Colors.primary },
  orderInfo: { flex: 1 },
  orderBuyer: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  orderProduct: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  orderStatus: { paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.full },
  orderStatusText: { fontFamily: FontFamily.medium, fontSize: 10 },
  advisoryCard: { flexDirection: 'row', gap: Spacing[3], padding: Spacing[3], backgroundColor: Colors.background, borderRadius: Radius.lg },
  advisoryTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  advisoryText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18, marginTop: 2 },
});
