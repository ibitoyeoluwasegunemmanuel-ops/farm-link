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

type Props = NativeStackScreenProps<ProfileStackParamList, 'MarketPrices'>;

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Fruits', 'Tubers', 'Cash Crops'];

const PRICES = [
  { id: '1', name: 'Maize (White)', unit: 'per 100kg bag', price: 38000, change: 5.2, cat: 'Grains', market: 'Mile 12, Lagos' },
  { id: '2', name: 'Rice (Local)', unit: 'per 50kg bag', price: 52000, change: -2.1, cat: 'Grains', market: 'Kano Central' },
  { id: '3', name: 'Tomatoes', unit: 'per basket', price: 18000, change: 12.4, cat: 'Vegetables', market: 'Bodija, Ibadan' },
  { id: '4', name: 'Yam (Medium)', unit: 'per tuber', price: 2500, change: 0.8, cat: 'Tubers', market: 'Makurdi' },
  { id: '5', name: 'Cassava (Wet)', unit: 'per tonne', price: 85000, change: -1.5, cat: 'Tubers', market: 'Enugu' },
  { id: '6', name: 'Cocoa (Dry)', unit: 'per tonne', price: 1850000, change: 8.3, cat: 'Cash Crops', market: 'Ondo' },
  { id: '7', name: 'Groundnut', unit: 'per 100kg bag', price: 62000, change: 3.1, cat: 'Cash Crops', market: 'Kano' },
  { id: '8', name: 'Pepper (Dry)', unit: 'per kg', price: 1800, change: -4.2, cat: 'Vegetables', market: 'Mile 12, Lagos' },
  { id: '9', name: 'Plantain', unit: 'per bunch', price: 3500, change: 1.9, cat: 'Fruits', market: 'Anambra' },
  { id: '10', name: 'Orange', unit: 'per 100-pack', price: 5000, change: -0.5, cat: 'Fruits', market: 'Benue' },
  { id: '11', name: 'Sorghum', unit: 'per 100kg bag', price: 35000, change: 2.7, cat: 'Grains', market: 'Katsina' },
  { id: '12', name: 'Palm Oil (Crude)', unit: 'per 25L Jerry', price: 42000, change: 6.1, cat: 'Cash Crops', market: 'Rivers' },
];

export default function MarketPricesScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PRICES.filter(p =>
    (activeCategory === 'All' || p.cat === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.headerGrad}>
        <Header title="Market Prices" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.updateRow}>
          <View style={styles.liveDot} />
          <Text style={styles.updateText}>Live prices · Updated just now</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search commodity..." />
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
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.commodity}>{item.name}</Text>
              <Text style={styles.market}><Ionicons name="location-outline" size={12} /> {item.market}</Text>
              <Text style={styles.unit}>{item.unit}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <View style={[styles.changePill, { backgroundColor: item.change >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons name={item.change >= 0 ? 'trending-up' : 'trending-down'} size={12} color={item.change >= 0 ? Colors.success : Colors.error} />
                <Text style={[styles.changeText, { color: item.change >= 0 ? Colors.success : Colors.error }]}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </Text>
              </View>
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
  updateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], marginTop: -Spacing[2] },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  updateText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  searchWrap: { paddingHorizontal: Spacing[4], paddingTop: Spacing[3] },
  catScroll: { maxHeight: 48, marginTop: Spacing[3] },
  catChip: { paddingHorizontal: Spacing[4], paddingVertical: Spacing[2], borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  list: { padding: Spacing[4], gap: Spacing[3] },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  cardLeft: { flex: 1 },
  commodity: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  market: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  unit: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  cardRight: { alignItems: 'flex-end', gap: Spacing[2] },
  price: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  changePill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing[2], paddingVertical: 2, borderRadius: Radius.full },
  changeText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
});
