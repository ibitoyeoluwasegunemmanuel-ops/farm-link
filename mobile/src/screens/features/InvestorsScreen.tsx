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

type Props = NativeStackScreenProps<ProfileStackParamList, 'Investors'>;

const OPPORTUNITIES = [
  { id: '1', title: 'Tomato Farm — Kano State', farmer: 'Musa Abdullahi Farms', fundingGoal: 2000000, raised: 1450000, returns: 28, duration: '6 months', crop: '🍅', daysLeft: 18, backers: 34 },
  { id: '2', title: 'Maize Cultivation — Benue', farmer: 'GreenField Agro', fundingGoal: 3500000, raised: 3500000, returns: 22, duration: '5 months', crop: '🌽', daysLeft: 0, backers: 67 },
  { id: '3', title: 'Rice Farm — Kebbi State', farmer: 'Kebbi Rice Cooperative', fundingGoal: 5000000, raised: 2800000, returns: 25, duration: '8 months', crop: '🌾', daysLeft: 32, backers: 41 },
  { id: '4', title: 'Cassava Processing Plant', farmer: 'Eastern Agro Industries', fundingGoal: 8000000, raised: 4200000, returns: 35, duration: '12 months', crop: '🌿', daysLeft: 45, backers: 29 },
  { id: '5', title: 'Poultry Farm Scale-Up', farmer: 'Sunrise Farms Ltd', fundingGoal: 1500000, raised: 1500000, returns: 20, duration: '4 months', crop: '🐔', daysLeft: 0, backers: 52 },
];

const MY_INVESTMENTS = [
  { id: 'i1', title: 'Tomato Farm — Lagos', amount: 250000, returns: 28, status: 'Active', maturity: 'Feb 2025', progress: 65 },
];

export default function InvestorsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio'>('opportunities');

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#B71C1C', '#C62828']} style={styles.headerGrad}>
        <Header title="Farm Investment" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.portfolioSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{formatCurrency(250000)}</Text>
            <Text style={styles.summaryLabel}>Total Invested</Text>
          </View>
          <View style={[styles.summaryItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.summaryVal}>+28%</Text>
            <Text style={styles.summaryLabel}>Avg Returns</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{formatCurrency(320000)}</Text>
            <Text style={styles.summaryLabel}>Expected Payout</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        {(['opportunities', 'portfolio'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'opportunities' ? 'Opportunities' : 'My Portfolio'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'opportunities' && (
        <FlatList
          data={OPPORTUNITIES}
          keyExtractor={o => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>{OPPORTUNITIES.length} opportunities available</Text>
              <TouchableOpacity style={styles.sortBtn}>
                <Ionicons name="filter-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.sortBtnText}>Filter</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const pct = Math.round((item.raised / item.fundingGoal) * 100);
            const isFull = item.daysLeft === 0;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cropEmoji}>{item.crop}</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardFarmer}>{item.farmer}</Text>
                  </View>
                  <View style={[styles.fundedBadge, { backgroundColor: isFull ? '#E8F5E9' : '#FFF8E1' }]}>
                    <Text style={[styles.fundedText, { color: isFull ? Colors.success : Colors.warning }]}>
                      {isFull ? '✓ Funded' : `${item.daysLeft}d left`}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: isFull ? Colors.success : Colors.primary }]} />
                  </View>
                  <View style={styles.progressLabels}>
                    <Text style={styles.raisedText}>{formatCurrency(item.raised)} raised</Text>
                    <Text style={styles.pctText}>{pct}%</Text>
                    <Text style={styles.goalText}>{formatCurrency(item.fundingGoal)}</Text>
                  </View>
                </View>

                <View style={styles.cardStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{item.returns}%</Text>
                    <Text style={styles.statLabel}>Returns</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{item.duration}</Text>
                    <Text style={styles.statLabel}>Duration</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statVal}>{item.backers}</Text>
                    <Text style={styles.statLabel}>Investors</Text>
                  </View>
                </View>

                {!isFull && (
                  <TouchableOpacity style={styles.investBtn} onPress={() => Alert.alert('Invest', `Investment in "${item.title}" coming soon.`)}>
                    <Text style={styles.investBtnText}>Invest Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {activeTab === 'portfolio' && (
        <ScrollView contentContainerStyle={styles.list}>
          {MY_INVESTMENTS.length === 0 ? (
            <View style={styles.emptyPortfolio}>
              <Ionicons name="trending-up-outline" size={64} color={Colors.borderLight} />
              <Text style={styles.emptyTitle}>No investments yet</Text>
              <Text style={styles.emptySub}>Start investing in farms and earn up to 35% returns</Text>
              <TouchableOpacity style={styles.startBtn} onPress={() => setActiveTab('opportunities')}>
                <Text style={styles.startBtnText}>Explore Opportunities</Text>
              </TouchableOpacity>
            </View>
          ) : (
            MY_INVESTMENTS.map(inv => (
              <View key={inv.id} style={styles.portfolioCard}>
                <View style={styles.portHeader}>
                  <Text style={styles.portTitle}>{inv.title}</Text>
                  <View style={styles.activeChip}><Text style={styles.activeChipText}>{inv.status}</Text></View>
                </View>
                <View style={styles.portStats}>
                  <View style={styles.portStat}><Text style={styles.portStatVal}>{formatCurrency(inv.amount)}</Text><Text style={styles.portStatLabel}>Invested</Text></View>
                  <View style={styles.portStat}><Text style={styles.portStatVal}>{inv.returns}%</Text><Text style={styles.portStatLabel}>Expected Return</Text></View>
                  <View style={styles.portStat}><Text style={styles.portStatVal}>{inv.maturity}</Text><Text style={styles.portStatLabel}>Maturity</Text></View>
                </View>
                <View style={styles.portProgress}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${inv.progress}%` }]} />
                  </View>
                  <Text style={styles.portPct}>{inv.progress}% of farm cycle complete</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  portfolioSummary: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing[2] },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing[3] },
  summaryVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tab: { flex: 1, paddingVertical: Spacing[3], alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#C62828' },
  tabText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  tabTextActive: { color: '#C62828' },
  list: { padding: Spacing[4], gap: Spacing[3] },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[2] },
  filterLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  sortBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  cropEmoji: { fontSize: 32 },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  cardFarmer: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  fundedBadge: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full },
  fundedText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  progressSection: { gap: Spacing[2] },
  progressBar: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  raisedText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  pctText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.textPrimary },
  goalText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  cardStats: { flexDirection: 'row', paddingTop: Spacing[3], borderTopWidth: 1, borderTopColor: Colors.borderLight },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  investBtn: { backgroundColor: '#C62828', borderRadius: Radius.lg, paddingVertical: Spacing[3], alignItems: 'center' },
  investBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  emptyPortfolio: { alignItems: 'center', gap: Spacing[3], paddingVertical: Spacing[8] },
  emptyTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl, color: Colors.textPrimary },
  emptySub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  startBtn: { backgroundColor: '#C62828', borderRadius: Radius.lg, paddingHorizontal: Spacing[6], paddingVertical: Spacing[3] },
  startBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  portfolioCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  portHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  portTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, flex: 1 },
  activeChip: { backgroundColor: '#E8F5E9', paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full },
  activeChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.success },
  portStats: { flexDirection: 'row' },
  portStat: { flex: 1, alignItems: 'center' },
  portStatVal: { fontFamily: FontFamily.bold, fontSize: FontSize.sm, color: Colors.textPrimary },
  portStatLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  portProgress: { gap: Spacing[2] },
  portPct: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'center' },
});
