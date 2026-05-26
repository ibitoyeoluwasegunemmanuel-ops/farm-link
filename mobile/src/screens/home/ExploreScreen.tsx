import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Header, SearchBar, PostCard, EmptyState } from '../../components/common';

type Props = NativeStackScreenProps<HomeStackParamList, 'Explore'>;

export default function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.flex}>
      <Header title="Explore" showBack onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search posts, farmers, produce..."
          autoFocus
        />
      </View>
      <EmptyState
        icon="search-outline"
        title="Search FarmLink"
        description="Find farmers, produce listings, tips, and news from across Nigeria."
        compact
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { padding: Spacing[4] },
});
