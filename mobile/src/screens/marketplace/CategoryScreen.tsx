import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Header, ProductCard } from '../../components/common';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Category'>;

const PRODUCTS = [
  { id: '1', name: 'White Maize', price: 55000, unit: 'bag', farmerName: 'Emeka Farms', location: 'Lagos', verified: true },
  { id: '2', name: 'Yellow Maize', price: 52000, unit: 'bag', farmerName: 'Adamu Farm', location: 'Kano', verified: false },
];

export default function CategoryScreen({ navigation, route }: Props) {
  return (
    <View style={styles.flex}>
      <Header title={route.params.categoryName} showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={PRODUCTS}
        keyExtractor={p => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard {...item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
        )}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  row: { justifyContent: 'space-between' },
});
