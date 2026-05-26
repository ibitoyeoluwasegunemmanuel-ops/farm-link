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

type Props = NativeStackScreenProps<ProfileStackParamList, 'Knowledge'>;

const CATEGORIES = ['All', 'Crop Guide', 'Pest & Disease', 'Soil Health', 'Irrigation', 'Post-Harvest', 'Finance'];

const ARTICLES = [
  { id: '1', title: 'Complete Guide to Cassava Farming in Nigeria', category: 'Crop Guide', readTime: '8 min', author: 'Dr. Emeka Obi', icon: '🌿', featured: true },
  { id: '2', title: 'Identifying and Treating Tomato Late Blight', category: 'Pest & Disease', readTime: '5 min', author: 'AgriExtension Nigeria', icon: '🍅', featured: true },
  { id: '3', title: 'Soil Testing 101: Why Your Crops Need It', category: 'Soil Health', readTime: '6 min', author: 'IITA Research', icon: '🌱', featured: false },
  { id: '4', title: 'Drip Irrigation for Smallholder Farmers', category: 'Irrigation', readTime: '7 min', author: 'FarmLink Team', icon: '💧', featured: false },
  { id: '5', title: 'Post-Harvest Handling of Maize to Reduce Losses', category: 'Post-Harvest', readTime: '5 min', author: 'FMARD Nigeria', icon: '🌽', featured: false },
  { id: '6', title: 'How to Access Agricultural Loans in Nigeria 2024', category: 'Finance', readTime: '4 min', author: 'FarmLink Finance', icon: '💰', featured: false },
  { id: '7', title: 'NPK Fertilizer Application Guide by Crop Type', category: 'Soil Health', readTime: '9 min', author: 'Dr. Amaka Nwosu', icon: '🌾', featured: false },
  { id: '8', title: 'Pepper Farming: From Planting to Market', category: 'Crop Guide', readTime: '11 min', author: 'AgriExtension Nigeria', icon: '🌶️', featured: false },
];

const VIDEOS = [
  { id: 'v1', title: 'How to Plant Yam Using Minisett Technique', duration: '12:34', views: '24K' },
  { id: 'v2', title: 'Organic Composting at Home', duration: '8:20', views: '18K' },
  { id: 'v3', title: 'Greenhouse Setup for Vegetable Farming', duration: '15:47', views: '31K' },
];

export default function KnowledgeScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ARTICLES.filter(a =>
    (activeCategory === 'All' || a.category === activeCategory) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  );
  const featured = filtered.filter(a => a.featured);
  const regular = filtered.filter(a => !a.featured);

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#4A148C', '#7B1FA2']} style={styles.headerGrad}>
        <Header title="Knowledge Hub" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <Text style={styles.headerSub}>Learn. Grow. Profit.</Text>
      </LinearGradient>

      <FlatList
        data={regular}
        keyExtractor={a => a.id}
        ListHeaderComponent={
          <>
            <View style={styles.searchWrap}>
              <SearchBar value={search} onChangeText={setSearch} placeholder="Search articles..." />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: Spacing[4], gap: Spacing[2] }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.catChip, activeCategory === c && styles.catChipActive]} onPress={() => setActiveCategory(c)}>
                  <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {featured.length > 0 && (
              <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>Featured</Text>
                {featured.map(a => (
                  <TouchableOpacity key={a.id} style={styles.featuredCard}>
                    <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.featuredGrad}>
                      <Text style={styles.featuredEmoji}>{a.icon}</Text>
                      <View style={styles.featuredMeta}>
                        <View style={styles.catBadge}><Text style={styles.catBadgeText}>{a.category}</Text></View>
                        <Text style={styles.featuredTitle}>{a.title}</Text>
                        <View style={styles.featuredFooter}>
                          <Text style={styles.featuredAuthor}>{a.author}</Text>
                          <Text style={styles.featuredTime}>{a.readTime} read</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.videoSection}>
              <Text style={[styles.sectionTitle, { paddingHorizontal: Spacing[4] }]}>Video Tutorials</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing[4], gap: Spacing[3] }}>
                {VIDEOS.map(v => (
                  <TouchableOpacity key={v.id} style={styles.videoCard}>
                    <View style={styles.videoThumb}>
                      <Ionicons name="play-circle" size={36} color={Colors.white} />
                    </View>
                    <Text style={styles.videoTitle} numberOfLines={2}>{v.title}</Text>
                    <Text style={styles.videoMeta}>{v.duration} · {v.views} views</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {regular.length > 0 && <Text style={[styles.sectionTitle, { paddingHorizontal: Spacing[4], marginBottom: Spacing[2] }]}>Articles</Text>}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.articleCard}>
            <Text style={styles.articleEmoji}>{item.icon}</Text>
            <View style={styles.articleInfo}>
              <Text style={styles.articleCat}>{item.category}</Text>
              <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleAuthor}>{item.author}</Text>
                <Text style={styles.articleTime}>{item.readTime} read</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: Spacing[6] }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4] },
  headerSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: -Spacing[2] },
  searchWrap: { paddingHorizontal: Spacing[4], paddingTop: Spacing[3] },
  catScroll: { maxHeight: 48, marginTop: Spacing[3], marginBottom: Spacing[2] },
  catChip: { paddingHorizontal: Spacing[4], paddingVertical: Spacing[2], borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight },
  catChipActive: { backgroundColor: '#7B1FA2', borderColor: '#7B1FA2' },
  catText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  featuredSection: { paddingHorizontal: Spacing[4], marginBottom: Spacing[4] },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  featuredCard: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing[3] },
  featuredGrad: { flexDirection: 'row', padding: Spacing[4], gap: Spacing[3] },
  featuredEmoji: { fontSize: 40 },
  featuredMeta: { flex: 1, gap: Spacing[2] },
  catBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: Spacing[2], paddingVertical: 2, alignSelf: 'flex-start' },
  catBadgeText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.white },
  featuredTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white, lineHeight: 22 },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  featuredAuthor: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  featuredTime: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  videoSection: { marginBottom: Spacing[4] },
  videoCard: { width: 180 },
  videoThumb: { width: 180, height: 100, borderRadius: Radius.lg, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[2] },
  videoTitle: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  videoMeta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  articleCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, marginHorizontal: Spacing[4], marginBottom: Spacing[3], borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  articleEmoji: { fontSize: 28 },
  articleInfo: { flex: 1 },
  articleCat: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: '#7B1FA2', marginBottom: 2 },
  articleTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  articleMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing[2] },
  articleAuthor: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  articleTime: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
});
