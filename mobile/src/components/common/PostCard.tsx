import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './Badge';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface PostCardProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  verified?: boolean;
  timeAgo: string;
  content: string;
  mediaUris?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  tags?: string[];
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onAuthorPress?: () => void;
  style?: ViewStyle;
  showBuyButton?: boolean;
  productPrice?: number;
  onBuy?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  authorName,
  authorAvatar,
  authorRole,
  verified = false,
  timeAgo,
  content,
  mediaUris,
  likesCount,
  commentsCount,
  sharesCount = 0,
  isLiked = false,
  isSaved = false,
  tags,
  onPress,
  onLike,
  onComment,
  onShare,
  onSave,
  onAuthorPress,
  style,
  showBuyButton = false,
  productPrice,
  onBuy,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [saved, setSaved] = useState(isSaved);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !liked;
    setLiked(next);
    setLocalLikes(prev => next ? prev + 1 : prev - 1);
    onLike?.();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(prev => !prev);
    onSave?.();
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.97}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorRow} onPress={onAuthorPress} activeOpacity={0.8}>
          <Avatar uri={authorAvatar} name={authorName} size="sm" />
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName} numberOfLines={1}>{authorName}</Text>
              {verified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={styles.authorMeta}>{authorRole ? `${authorRole} · ` : ''}{timeAgo}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content} numberOfLines={4}>{content}</Text>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Media */}
      {mediaUris && mediaUris.length > 0 && (
        <View style={styles.mediaWrap}>
          {mediaUris.length === 1 ? (
            <Image source={{ uri: mediaUris[0] }} style={styles.mediaSingle} />
          ) : mediaUris.length === 2 ? (
            <View style={styles.mediaDouble}>
              {mediaUris.slice(0, 2).map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.mediaHalf} />
              ))}
            </View>
          ) : (
            <View style={styles.mediaGrid}>
              <Image source={{ uri: mediaUris[0] }} style={styles.mediaMain} />
              <View style={styles.mediaColumn}>
                {mediaUris.slice(1, 3).map((uri, i) => (
                  <View key={i} style={styles.mediaSmallWrap}>
                    <Image source={{ uri }} style={styles.mediaSmall} />
                    {i === 1 && mediaUris.length > 3 && (
                      <View style={styles.mediaMore}>
                        <Text style={styles.mediaMoreText}>+{mediaUris.length - 3}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Buy button (marketplace posts) */}
      {showBuyButton && productPrice && (
        <TouchableOpacity style={styles.buyBtn} onPress={onBuy}>
          <Ionicons name="cart-outline" size={16} color={Colors.white} />
          <Text style={styles.buyBtnText}>Buy · ₦{productPrice.toLocaleString()}</Text>
        </TouchableOpacity>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? Colors.error : Colors.textSecondary}
          />
          <Text style={[styles.actionText, liked && { color: Colors.error }]}>
            {localLikes > 0 ? localLikes : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
          {commentsCount > 0 && (
            <Text style={styles.actionText}>{commentsCount}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onShare}>
          <Ionicons name="arrow-redo-outline" size={20} color={Colors.textSecondary} />
          {sharesCount > 0 && (
            <Text style={styles.actionText}>{sharesCount}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.action} onPress={handleSave}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? Colors.primary : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    marginBottom: Spacing[2],
    borderBottomWidth: 8,
    borderBottomColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorInfo: { marginLeft: Spacing[2], flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  verifiedIcon: { marginLeft: 3 },
  authorMeta: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  moreBtn: { padding: 4 },
  content: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing[3],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  tag: {
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  mediaWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing[3],
  },
  mediaSingle: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  mediaDouble: { flexDirection: 'row', gap: 2 },
  mediaHalf: {
    flex: 1,
    height: 160,
    resizeMode: 'cover',
  },
  mediaGrid: { flexDirection: 'row', gap: 2 },
  mediaMain: {
    flex: 2,
    height: 200,
    resizeMode: 'cover',
  },
  mediaColumn: { flex: 1, gap: 2 },
  mediaSmallWrap: { flex: 1, position: 'relative' },
  mediaSmall: { flex: 1, height: 99, resizeMode: 'cover' },
  mediaMore: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaMoreText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  buyBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing[3],
    gap: Spacing[1],
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[2],
    gap: 5,
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  spacer: { flex: 1 },
});
