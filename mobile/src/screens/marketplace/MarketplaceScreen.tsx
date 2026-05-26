import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, SearchBar, ProductCard } from '../../components/common';
import { useCartStore } from '../../store/cartStore';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'MarketplaceHome'>;

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps-outline' },
  { id: 'grains', name: 'Grains', icon: 'nutrition-outline' },
  { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline' },
  { id: 'fruits', name: 'Fruits', icon: 'color-fill-outline' },
  { id: 'livestock', name: 'Livestock', icon: 'paw-outline' },
  { id: 'tubers', name: 'Tubers', icon: 'git-merge-outline' },
  { id: 'seeds', name: 'Seeds', icon: 'ellipse-outline' },
];

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'White Maize', price: 55000, unit: 'bag (100kg)', quantity: 200, farmerName: 'Emeka Farms', location: 'Lagos', verified: true },
  { id: '2', name: 'Cassava (Dried)', price: 8500, unit: 'bag', quantity: 500, farmerName: 'Fatima Agro', location: 'Kaduna', verified: true },
  { id: '3', name: 'Fresh Tomatoes', price: 12000, unit: 'crate', quantity: 80, farmerName: 'Kola Fresh', location: 'Ogun', verified: false },
  { id: '4', name: 'Yam Tubers', price: 3500, unit: 'tuber', quantity: 1000, farmerName: 'Nnamdi Farm', location: 'Enugu', verified: true },
  { id: '5', name: 'Garri (White)', price: 35000, unit: 'bag', quantity: 150, farmerName: 'Chinwe Produce', location: 'Delta', verified: false },
  { id: '6', name: 'Groundnuts', price: 22000, unit: 'bag (50kg)', quantity: 300, farmerName: 'Suleiman Farms', location: 'Kano', verified: true },
];

export default function MarketplaceScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <View style={styles.flex}>
      <Header
        title="Marketplace"
        subtitle="Buy directly from farmers"
        rightActions={
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={22} color={Colors.textPrimary} />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search produce, farmers..."
          showFilter
          onFilterPress={() => {}}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={activeCategory === cat.id ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.catText, activeCategory === cat.id && styles.catTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products grid */}
      <FlatList
        data={SAMPLE_PRODUCTS}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            name={item.name}
            price={item.price}
            unit={item.unit}
            quantity={item.quantity}
            farmerName={item.farmerName}
            location={item.location}
            verified={item.verified}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  cartBtn: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { fontFamily: FontFamily.bold, fontSize: 9, color: Colors.white },
  searchWrap: { paddingHorizontal: Spacing[4], paddingTop: Spacing[3], paddingBottom: Spacing[2] },
  catScroll: { maxHeight: 48 },
  catContent: { paddingHorizontal: Spacing[4], gap: Spacing[2], alignItems: 'center' },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.white,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  gridContent: { padding: Spacing[4], paddingTop: Spacing[3] },
  row: { justifyContent: 'space-between' },
});
