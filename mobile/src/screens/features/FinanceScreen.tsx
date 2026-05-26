import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Finance'>;

const LOAN_PRODUCTS = [
  {
    id: '1', name: 'FarmStart Loan', description: 'For new farmers to purchase seeds, fertilizer and basic equipment', amount: { min: 50000, max: 500000 }, rate: 12, tenor: '3–12 months', icon: 'leaf', color: Colors.primary,
  },
  {
    id: '2', name: 'Input Credit', description: 'Get farm inputs now, pay after harvest. Tied to specific crop season', amount: { min: 20000, max: 200000 }, rate: 8, tenor: '4–6 months', icon: 'nutrition', color: Colors.success,
  },
  {
    id: '3', name: 'Equipment Finance', description: 'Buy or lease farming equipment with flexible repayment', amount: { min: 100000, max: 5000000 }, rate: 15, tenor: '12–36 months', icon: 'construct', color: '#FF6F00',
  },
  {
    id: '4', name: 'AgriInsurance', description: 'Protect your farm against weather, pests, and market risks', amount: { min: 5000, max: 50000 }, rate: 0, tenor: 'Annual', icon: 'shield-checkmark', color: '#1565C0',
  },
];

const GRANTS = [
  { name: 'NIRSAL MFB AgroGeo', status: 'Open', deadline: 'Dec 31, 2024', amount: 'Up to ₦1M', eligibility: 'All farmers with NIN' },
  { name: 'CBN AGSMEIS', status: 'Open', deadline: 'Ongoing', amount: 'Up to ₦10M', eligibility: 'Agribusinesses with CAC' },
  { name: 'BOI Agricultural Loan', status: 'Closed', deadline: 'Ended', amount: 'Up to ₦50M', eligibility: 'SMEs with 3yr records' },
];

export default function FinanceScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'loans' | 'grants' | 'insurance'>('loans');

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.headerGrad}>
        <Header title="Farm Finance" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.creditScore}>
          <Text style={styles.scoreLabel}>Your FarmLink Credit Score</Text>
          <Text style={styles.scoreVal}>720</Text>
          <Text style={styles.scoreGrade}>Good · Eligible for up to {formatCurrency(1000000)}</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        {(['loans', 'grants', 'insurance'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'loans' && (
          <>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={18} color={Colors.info} />
              <Text style={styles.infoText}>All loans are processed within 48–72 hours for verified farmers. Repayment is automated via your FarmLink wallet.</Text>
            </View>
            {LOAN_PRODUCTS.map(loan => (
              <View key={loan.id} style={styles.loanCard}>
                <View style={[styles.loanIcon, { backgroundColor: loan.color + '20' }]}>
                  <Ionicons name={loan.icon as any} size={24} color={loan.color} />
                </View>
                <View style={styles.loanBody}>
                  <Text style={styles.loanName}>{loan.name}</Text>
                  <Text style={styles.loanDesc}>{loan.description}</Text>
                  <View style={styles.loanStats}>
                    <View style={styles.loanStat}>
                      <Text style={styles.loanStatLabel}>Amount</Text>
                      <Text style={styles.loanStatVal}>{formatCurrency(loan.amount.min)}–{formatCurrency(loan.amount.max)}</Text>
                    </View>
                    <View style={styles.loanStat}>
                      <Text style={styles.loanStatLabel}>Interest</Text>
                      <Text style={styles.loanStatVal}>{loan.rate}% p.a.</Text>
                    </View>
                    <View style={styles.loanStat}>
                      <Text style={styles.loanStatLabel}>Tenor</Text>
                      <Text style={styles.loanStatVal}>{loan.tenor}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.applyBtn, { backgroundColor: loan.color }]} onPress={() => Alert.alert('Apply', `Application for ${loan.name} coming soon.`)}>
                    <Text style={styles.applyBtnText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'grants' && (
          <>
            <Text style={styles.sectionTitle}>Available Grants & Programs</Text>
            {GRANTS.map((g, i) => (
              <View key={i} style={styles.grantCard}>
                <View style={styles.grantTop}>
                  <Text style={styles.grantName}>{g.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: g.status === 'Open' ? '#E8F5E9' : '#F5F5F5' }]}>
                    <Text style={[styles.statusText, { color: g.status === 'Open' ? Colors.success : Colors.textTertiary }]}>{g.status}</Text>
                  </View>
                </View>
                <View style={styles.grantRow}><Text style={styles.grantLabel}>Amount:</Text><Text style={styles.grantVal}>{g.amount}</Text></View>
                <View style={styles.grantRow}><Text style={styles.grantLabel}>Deadline:</Text><Text style={styles.grantVal}>{g.deadline}</Text></View>
                <View style={styles.grantRow}><Text style={styles.grantLabel}>Eligibility:</Text><Text style={styles.grantVal}>{g.eligibility}</Text></View>
                {g.status === 'Open' && (
                  <TouchableOpacity style={styles.learnBtn} onPress={() => Alert.alert('Grant', `Details for ${g.name} coming soon.`)}>
                    <Text style={styles.learnBtnText}>Learn More</Text>
                    <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}

        {activeTab === 'insurance' && (
          <>
            <View style={styles.insuranceHero}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
              <Text style={styles.insuranceTitle}>Protect Your Farm</Text>
              <Text style={styles.insuranceSub}>Get coverage against weather events, pests, crop failure, and market price drops</Text>
            </View>
            {[
              { icon: 'thunderstorm-outline', title: 'Weather Insurance', desc: 'Covers drought, flood, and extreme weather damage', price: '₦5,000/season' },
              { icon: 'bug-outline', title: 'Pest & Disease Cover', desc: 'Compensation for major pest outbreaks and disease losses', price: '₦3,500/season' },
              { icon: 'trending-down-outline', title: 'Price Risk Cover', desc: 'Protection when market prices fall below your production cost', price: '₦8,000/season' },
            ].map((ins, i) => (
              <View key={i} style={styles.insCard}>
                <View style={styles.insIcon}><Ionicons name={ins.icon as any} size={24} color={Colors.primary} /></View>
                <View style={styles.insInfo}>
                  <Text style={styles.insTitle}>{ins.title}</Text>
                  <Text style={styles.insDesc}>{ins.desc}</Text>
                </View>
                <View style={styles.insRight}>
                  <Text style={styles.insPrice}>{ins.price}</Text>
                  <TouchableOpacity style={styles.insBtn} onPress={() => Alert.alert('Insurance', 'Insurance enrollment coming soon.')}>
                    <Text style={styles.insBtnText}>Get</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[5] },
  creditScore: { alignItems: 'center', paddingVertical: Spacing[3] },
  scoreLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  scoreVal: { fontFamily: FontFamily.bold, fontSize: 48, color: Colors.white },
  scoreGrade: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tab: { flex: 1, paddingVertical: Spacing[3], alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  content: { padding: Spacing[4], gap: Spacing[3] },
  infoCard: { flexDirection: 'row', gap: Spacing[2], backgroundColor: '#E3F2FD', borderRadius: Radius.lg, padding: Spacing[3] },
  infoText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.info, lineHeight: 20 },
  loanCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  loanIcon: { width: 48, height: 48, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[3] },
  loanBody: { gap: Spacing[2] },
  loanName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  loanDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  loanStats: { flexDirection: 'row', gap: Spacing[3], paddingVertical: Spacing[3], borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.borderLight },
  loanStat: { flex: 1 },
  loanStatLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  loanStatVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.textPrimary, marginTop: 2 },
  applyBtn: { borderRadius: Radius.lg, paddingVertical: Spacing[3], alignItems: 'center', marginTop: Spacing[2] },
  applyBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  grantCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[2] },
  grantTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grantName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, flex: 1 },
  statusBadge: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Radius.full },
  statusText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  grantRow: { flexDirection: 'row', gap: Spacing[2] },
  grantLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary, width: 80 },
  grantVal: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1 },
  learnBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1], marginTop: Spacing[2] },
  learnBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary },
  insuranceHero: { alignItems: 'center', gap: Spacing[2], paddingVertical: Spacing[4] },
  insuranceTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  insuranceSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  insCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  insIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  insInfo: { flex: 1 },
  insTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  insDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  insRight: { alignItems: 'flex-end', gap: Spacing[2] },
  insPrice: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  insBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: Spacing[4], paddingVertical: Spacing[2] },
  insBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.white },
});
