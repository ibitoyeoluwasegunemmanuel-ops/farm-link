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

type Props = NativeStackScreenProps<HomeStackParamList, 'BuyerDashboard'>;

const RECENT_ORDERS = [
  { id: 'o1', product: 'Fresh Tomatoes × 100kg', seller: 'Adewale Farms', amount: 56000, status: 'In Transit', date: 'Today' },
  { id: 'o2', product: 'White Maize × 200kg', seller: 'GreenField Agro', amount: 76000, status: 'Delivered', date: 'Yesterday' },
  { id: 'o3', product: 'Palm Oil × 25L', seller: 'Eastern Agro', amount: 42000, status: 'Delivered', date: 'Dec 10' },
];

const SAVED_SELLERS = [
  { id: 's1', name: 'Adewale Farms', location: 'Oyo State', rating: 4.9, products: 12 },
  { id: 's2', name: 'GreenField Agro', location: 'Benue State', rating: 4.7, products: 8 },
  { id: 's3', name: 'Kebbi Rice Co-op', location: 'Kebbi State', rating: 4.8, products: 3 },
];

const PRICE_ALERTS = [
  { product: 'Tomatoes', targetPrice: 250, currentPrice: 280, triggered: false },
  { product: 'Rice (50kg)', targetPrice: 50000, currentPrice: 52000, triggered: false },
  { product: 'Maize (100kg)', targetPrice: 35000, currentPrice: 34500, triggered: true },
];

export default function BuyerDashboardScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);

  const getStatusColor = (s: string) => {
    if (s === 'Delivered') return Colors.success;
    if (s === 'In Transit') return Colors.warning;
    return Colors.info;
  };

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#0D47A1', '#1976D2']} style={styles.headerGrad}>
        <Header title="Buyer Dashboard" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'Buyer'} 🛒</Text>
          </View>
          <View style={styles.walletBadge}>
            <Ionicons name="wallet-outline" size={14} color={Colors.white} />
            <Text style={styles.walletBalance}>{formatCurrency(485000)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          {[
            { label: 'Total Orders', val: '28' },
            { label: 'In Escrow', val: formatCurrency(56000) },
            { label: 'Saved', val: formatCurrency(38500) },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryItem, i !== 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.summaryVal}>{s.val}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          {[
            { icon: 'search-outline', label: 'Find Produce', color: '#1976D2' },
            { icon: 'cart-outline', label: 'My Cart', color: Colors.primary },
            { icon: 'document-text-outline', label: 'Orders', color: Colors.success },
            { icon: 'analytics-outline', label: 'Spending', color: Colors.warning },
          ].map((a, i) => (
            <TouchableOpacity key={i} style={styles.quickAction}>
              <View style={[styles.qaIcon, { backgroundColor: a.color + '20' }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {RECENT_ORDERS.map(o => (
            <View key={o.id} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderProduct} numberOfLines={1}>{o.product}</Text>
                <Text style={styles.orderSeller}>{o.seller} · {o.date}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>{formatCurrency(o.amount)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(o.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(o.status) }]}>{o.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price Alerts</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {PRICE_ALERTS.map((a, i) => (
            <View key={i} style={[styles.alertRow, a.triggered && styles.alertRowTriggered]}>
              <View style={styles.alertInfo}>
                <Text style={styles.alertProduct}>{a.product}</Text>
                <Text style={styles.alertTarget}>Target: {typeof a.targetPrice === 'number' && a.targetPrice > 1000 ? formatCurrency(a.targetPrice) : `₦${a.targetPrice}/kg`}</Text>
              </View>
              <View style={styles.alertRight}>
                <Text style={[styles.currentPrice, { color: a.triggered ? Colors.success : Colors.textPrimary }]}>
                  {typeof a.currentPrice === 'number' && a.currentPrice > 1000 ? formatCurrency(a.currentPrice) : `₦${a.currentPrice}/kg`}
                </Text>
                {a.triggered ? (
                  <View style={styles.triggeredBadge}><Text style={styles.triggeredText}>Buy Now!</Text></View>
                ) : (
                  <Text style={styles.waitingText}>Watching...</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Sellers</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing[3] }}>
            {SAVED_SELLERS.map(s => (
              <TouchableOpacity key={s.id} style={styles.sellerCard}>
                <View style={styles.sellerAvatar}>
                  <Text style={styles.sellerInitial}>{s.name[0]}</Text>
                </View>
                <Text style={styles.sellerName} numberOfLines={1}>{s.name}</Text>
                <Text style={styles.sellerLoc}>{s.location}</Text>
                <View style={styles.sellerStats}>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Text style={styles.sellerRating}>{s.rating}</Text>
                  <Text style={styles.sellerProducts}>{s.products} items</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.insightCard}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.insightGrad}>
            <Ionicons name="bulb-outline" size={24} color={Colors.white} />
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Buying Insight</Text>
              <Text style={styles.insightText}>You save an average of 18% by buying directly from farmers vs. open markets. You've saved {formatCurrency(38500)} this month!</Text>
            </View>
          </LinearGradient>
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
  userName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  walletBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2] },
  walletBalance: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  summaryRow: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing[3] },
  summaryVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: Spacing[4], gap: Spacing[4] },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: Spacing[2] },
  qaIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  section: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  seeAll: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  orderCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[2], borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  orderLeft: { flex: 1 },
  orderProduct: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  orderSeller: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.full },
  statusText: { fontFamily: FontFamily.medium, fontSize: 10 },
  alertRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[2], borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  alertRowTriggered: { backgroundColor: '#F1F8E9', marginHorizontal: -Spacing[4], paddingHorizontal: Spacing[4], borderRadius: Radius.sm },
  alertInfo: { flex: 1 },
  alertProduct: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  alertTarget: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  alertRight: { alignItems: 'flex-end', gap: 4 },
  currentPrice: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  triggeredBadge: { backgroundColor: Colors.success, paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.full },
  triggeredText: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.white },
  waitingText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  sellerCard: { width: 110, alignItems: 'center', gap: Spacing[2], backgroundColor: Colors.background, borderRadius: Radius.lg, padding: Spacing[3] },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1976D2' + '20', alignItems: 'center', justifyContent: 'center' },
  sellerInitial: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: '#1976D2' },
  sellerName: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textPrimary, textAlign: 'center' },
  sellerLoc: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  sellerStats: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  sellerRating: { fontFamily: FontFamily.medium, fontSize: 10, color: Colors.textSecondary },
  sellerProducts: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary },
  insightCard: { borderRadius: Radius.xl, overflow: 'hidden' },
  insightGrad: { flexDirection: 'row', gap: Spacing[3], padding: Spacing[4], alignItems: 'flex-start' },
  insightTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white },
  insightText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginTop: 4 },
});
