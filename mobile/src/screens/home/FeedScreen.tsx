import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HomeHeader } from '../../components/common/Header';
import { PostCard, StoryAvatar, EmptyState, LoadingSpinner } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

// Sample feed data (will be replaced by API calls)
const SAMPLE_STORIES = [
  { id: '1', name: 'Your Story', hasNew: false, isMe: true },
  { id: '2', name: 'Emeka Farm', hasNew: true },
  { id: '3', name: 'AgriTech NG', hasNew: true },
  { id: '4', name: 'Kola Farms', hasNew: false },
  { id: '5', name: 'Fatima A.', hasNew: true },
  { id: '6', name: 'Nnamdi C.', hasNew: false },
];

const SAMPLE_POSTS = [
  {
    id: '1',
    authorName: 'Emeka Okafor',
    authorRole: 'Verified Farmer',
    verified: true,
    timeAgo: '2h ago',
    content: 'Fresh cassava harvest just came in! 500 bags available at ₦8,500 per bag. Delivery available across Lagos and Ogun state. DM or click Buy to order directly. 🌿',
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 15,
    tags: ['cassava', 'harvest', 'Lagos'],
    showBuyButton: true,
    productPrice: 8500,
  },
  {
    id: '2',
    authorName: 'AgriTech Nigeria',
    authorRole: 'Organization',
    verified: true,
    timeAgo: '4h ago',
    content: "BREAKING: New government subsidy programme releases ₦50bn for smallholder farmers. Apply before December 31st through your state's ministry of agriculture. Share this with every farmer you know!",
    likesCount: 1043,
    commentsCount: 204,
    sharesCount: 892,
    tags: ['subsidy', 'news', 'farming'],
  },
  {
    id: '3',
    authorName: 'Fatima Abdullahi',
    authorRole: 'Farmer · Kaduna',
    verified: false,
    timeAgo: '6h ago',
    content: 'My tomato farm after the rain this week. 3 acres of pure joy! Harvest coming in 2 weeks — already taking pre-orders. Price will be competitive. Who is interested?',
    likesCount: 87,
    commentsCount: 31,
    sharesCount: 12,
    tags: ['tomato', 'Kaduna', 'preharvest'],
  },
];

export default function FeedScreen() {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore((s) => s.user);
  const notifCount = useAppStore((s) => s.notifCount);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'market' | 'knowledge' | 'news'>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
  }, []);

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'market', label: 'Marketplace' },
    { key: 'knowledge', label: 'Knowledge' },
    { key: 'news', label: 'News' },
  ];

  const StoriesHeader = () => (
    <View>
      {/* Filter chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stories row */}
      <View style={styles.storiesSection}>
        <FlatList
          data={SAMPLE_STORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.storiesContent}
          renderItem={({ item }) => {
            if ((item as any).isMe) {
              return (
                <TouchableOpacity
                  style={styles.myStory}
                  onPress={() => navigation.navigate('CreatePost')}
                >
                  <View style={styles.myStoryAdd}>
                    <Ionicons name="add" size={22} color={Colors.white} />
                  </View>
                  <Text style={styles.storyName}>Post</Text>
                </TouchableOpacity>
              );
            }
            return (
              <StoryAvatar
                name={item.name}
                hasNew={(item as any).hasNew}
                onPress={() => navigation.navigate('Stories')}
              />
            );
          }}
        />
      </View>

      {/* Feed label */}
      <View style={styles.feedLabelRow}>
        <Text style={styles.feedLabel}>Recent Posts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <Text style={styles.exploreLink}>Explore more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <HomeHeader
        userName={user?.name}
        notifCount={notifCount}
        onNotif={() => navigation.navigate('Notifications')}
        onSearch={() => navigation.navigate('Explore')}
      />

      <FlatList
        data={SAMPLE_POSTS}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={<StoriesHeader />}
        renderItem={({ item }) => (
          <PostCard
            id={item.id}
            authorName={item.authorName}
            authorRole={item.authorRole}
            verified={item.verified}
            timeAgo={item.timeAgo}
            content={item.content}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            sharesCount={item.sharesCount}
            tags={item.tags}
            showBuyButton={item.showBuyButton}
            productPrice={item.productPrice}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            onComment={() => navigation.navigate('PostDetail', { postId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !refreshing ? (
            <EmptyState
              icon="leaf-outline"
              title="No posts yet"
              description="Be the first to share something with the farming community!"
              actionLabel="Create Post"
              onAction={() => navigation.navigate('CreatePost')}
            />
          ) : null
        }
      />

      {/* FAB — Create Post */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterChip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  filterTextActive: { color: Colors.white },
  storiesSection: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  storiesContent: {
    paddingHorizontal: Spacing[4],
  },
  myStory: {
    alignItems: 'center',
    marginRight: 12,
  },
  myStoryAdd: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  storyName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    maxWidth: 56,
    textAlign: 'center',
  },
  feedLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.background,
  },
  feedLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  exploreLink: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
