import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, SearchBar } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Equipment'>;

const CATEGORIES = ['All', 'Tractors', 'Irrigation', 'Planting', 'Harvesting', 'Processing'];

const EQUIPMENT = [
  { id: '1', name: 'John Deere 5E Tractor', category: 'Tractors', dailyRate: 35000, weeklyRate: 200000, owner: 'Adewale Farms', location: 'Oyo State', rating: 4.8, available: true, emoji: '🚜' },
  { id: '2', name: 'Kubota Rice Harvester', category: 'Harvesting', dailyRate: 45000, weeklyRate: 250000, owner: 'Green Valley Equipment', location: 'Kano State', rating: 4.6, available: true, emoji: '🌾' },
  { id: '3', name: 'Drip Irrigation Kit (1 Acre)', category: 'Irrigation', dailyRate: 8000, weeklyRate: 45000, owner: 'AgroTech Nigeria', location: 'Lagos', rating: 4.9, available: false, emoji: '💧' },
  { id: '4', name: 'Maize Sheller (Electric)', category: 'Processing', dailyRate: 12000, weeklyRate: 70000, owner: 'FarmEquip Co.', location: 'Ibadan', rating: 4.4, available: true, emoji: '⚙️' },
  { id: '5', name: 'Cassava Peeling Machine', category: 'Processing', dailyRate: 15000, weeklyRate: 85000, owner: 'Eastern Equipment Hub', location: 'Enugu', rating: 4.7, available: true, emoji: '🌿' },
  { id: '6', name: 'Seedling Transplanter', category: 'Planting', dailyRate: 20000, weeklyRate: 110000, owner: 'SmartFarm Nigeria', location: 'Benue', rating: 4.5, available: true, emoji: '🌱' },
];

export default function EquipmentScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = EQUIPMENT.filter(e =>
    (activeCategory === 'All' || e.category === activeCategory) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#4527A0', '#7B1FA2']} style={styles.headerGrad}>
        <Header title="Equipment Rental" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.statsRow}>
          {[{ val: '240+', label: 'Equipment' }, { val: '36', label: 'States' }, { val: '48h', label: 'Avg Response' }].map((s, i) => (
            <View key={i} style={[styles.statItem, i !== 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search equipment..." />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: Spacing[4], gap: Spacing[2] }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} style={[styles.catChip, activeCategory === c && styles.catChipActive]} onPress={() => setActiveCategory(c)}>
            <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={e => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.emojiBox}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.equipName} numberOfLines={1}>{item.name}</Text>
                  <View style={[styles.availBadge, { backgroundColor: item.available ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Text style={[styles.availText, { color: item.available ? Colors.success : Colors.error }]}>
                      {item.available ? 'Available' : 'Rented'}
                    </Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
                  <Text style={styles.metaText}>{item.location}</Text>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Text style={styles.metaText}>{item.rating}</Text>
                </View>
                <Text style={styles.ownerText}>By {item.owner}</Text>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <View style={styles.rateBox}>
                <Text style={styles.rateLabel}>Daily</Text>
                <Text style={styles.rateVal}>{formatCurrency(item.dailyRate)}</Text>
              </View>
              <View style={[styles.rateBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.borderLight }]}>
                <Text style={styles.rateLabel}>Weekly</Text>
                <Text style={styles.rateVal}>{formatCurrency(item.weeklyRate)}</Text>
              </View>
              <TouchableOpacity style={[styles.rentBtn, !item.available && styles.rentBtnDisabled]} disabled={!item.available}>
                <Text style={[styles.rentBtnText, !item.available && { color: Colors.textTertiary }]}>
                  {item.available ? 'Rent Now' : 'Unavailable'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  statsRow: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing[2] },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing[3] },
  statVal: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: Colors.white },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  searchWrap: { paddingHorizontal: Spacing[4], paddingTop: Spacing[3] },
  catScroll: { maxHeight: 48, marginTop: Spacing[3] },
  catChip: { paddingHorizontal: Spacing[4], paddingVertical: Spacing[2], borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight },
  catChipActive: { backgroundColor: '#7B1FA2', borderColor: '#7B1FA2' },
  catText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  list: { padding: Spacing[4], gap: Spacing[3] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', padding: Spacing[4], gap: Spacing[3] },
  emojiBox: { width: 52, height: 52, borderRadius: Radius.lg, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  cardInfo: { flex: 1, gap: Spacing[1] },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  equipName: { flex: 1, fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  availBadge: { paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.full },
  availText: { fontFamily: FontFamily.medium, fontSize: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginRight: Spacing[2] },
  ownerText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  cardBottom: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.borderLight },
  rateBox: { flex: 1, alignItems: 'center', paddingVertical: Spacing[3] },
  rateLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  rateVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, marginTop: 2 },
  rentBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing[3], backgroundColor: Colors.primary },
  rentBtnDisabled: { backgroundColor: Colors.borderLight },
  rentBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.white },
});
