import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { SearchBar, ProductCard, EmptyState } from '../../components/common';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Search'>;

export default function SearchScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params?.initialQuery || '');
  return (
    <View style={styles.flex}>
      <View style={styles.searchBar}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search produce..." autoFocus />
      </View>
      <EmptyState icon="search-outline" title="Search the marketplace" description="Find produce, farmers and listings across Nigeria." compact />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  searchBar: { padding: Spacing[4], paddingTop: 56 },
});
