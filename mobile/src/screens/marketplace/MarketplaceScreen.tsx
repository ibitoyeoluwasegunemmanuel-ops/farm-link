import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, SearchBar, ProductCard } from '../../components/common';
import { useCartStore } from '../../store/cartStore';
import { harvestService, Harvest } from '../../services/harvestService';

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

const FALLBACK_PRODUCTS: Harvest[] = [
  { id: '1', farmerId: '', cropType: 'White Maize', quantity: 200, unit: 'bag (100kg)', pricePerUnit: 55000, totalPrice: 0, quality: 'A', status: 'available', location: { state: 'Lagos' }, farmer: { id: '', fullName: 'Emeka Farms' } },
  { id: '2', farmerId: '', cropType: 'Cassava', quantity: 500, unit: 'bag', pricePerUnit: 8500, totalPrice: 0, quality: 'A', status: 'available', location: { state: 'Kaduna' }, farmer: { id: '', fullName: 'Fatima Agro' } },
  { id: '3', farmerId: '', cropType: 'Tomatoes', quantity: 80, unit: 'crate', pricePerUnit: 12000, totalPrice: 0, quality: 'B', status: 'available', location: { state: 'Ogun' }, farmer: { id: '', fullName: 'Kola Fresh' } },
  { id: '4', farmerId: '', cropType: 'Yam', quantity: 1000, unit: 'tuber', pricePerUnit: 3500, totalPrice: 0, quality: 'A', status: 'available', location: { state: 'Enugu' }, farmer: { id: '', fullName: 'Nnamdi Farm' } },
];

export default function MarketplaceScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  const fetchProducts = useCallback(async () => {
    try {
      const cropType = activeCategory !== 'all' ? activeCategory : undefined;
      const res = await harvestService.getListings({ cropType, limit: 40 });
      const data = res.data.data;
      setProducts(data.length > 0 ? data : FALLBACK_PRODUCTS);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filtered = products.filter((p) =>
    !search || p.cropType.toLowerCase().includes(search.toLowerCase())
  );

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

      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search produce, farmers..."
          showFilter
          onFilterPress={() => {}}
        />
      </View>

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

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="basket-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No listings found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              name={item.cropType}
              price={item.pricePerUnit}
              unit={item.unit}
              quantity={item.quantity}
              farmerName={item.farmer?.fullName || item.farmer?.farmName || 'Farmer'}
              location={item.location?.state || ''}
              verified={!!item.farmer}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing[3] },
  loaderText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 80, gap: Spacing[3] },
  emptyText: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary },
});
