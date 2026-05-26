import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius } from '../../constants/spacing';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

const FONT_MAP: Record<AvatarSize, number> = {
  xs: FontSize.xs,
  sm: FontSize.sm,
  md: FontSize.base,
  lg: FontSize.md,
  xl: FontSize.xl,
  '2xl': FontSize['3xl'],
};

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  verified?: boolean;
  online?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
  storyRing?: boolean;
  storyViewed?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  verified = false,
  online = false,
  style,
  onPress,
  storyRing = false,
  storyViewed = false,
}) => {
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  const content = (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
        storyRing && (storyViewed ? styles.storyRingViewed : styles.storyRingActive),
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: dimension - (storyRing ? 4 : 0), height: dimension - (storyRing ? 4 : 0), borderRadius: (dimension - (storyRing ? 4 : 0)) / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: storyRing ? dimension - 4 : dimension, height: storyRing ? dimension - 4 : dimension, borderRadius: dimension / 2 },
          ]}
        >
          <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
        </View>
      )}

      {verified && (
        <View style={[styles.badge, styles.verifiedBadge, { right: -2, bottom: -2 }]}>
          <Ionicons name="checkmark-circle" size={dimension * 0.3} color={Colors.primary} />
        </View>
      )}

      {online && (
        <View
          style={[
            styles.badge,
            styles.onlineBadge,
            { width: dimension * 0.25, height: dimension * 0.25, right: 0, bottom: 0 },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Story avatar - used in feed
interface StoryAvatarProps {
  uri?: string;
  name: string;
  hasNew?: boolean;
  onPress?: () => void;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({ uri, name, hasNew = false, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.storyWrapper} activeOpacity={0.8}>
    <View style={[styles.storyRingOuter, hasNew ? styles.storyRingActive : styles.storyRingViewed]}>
      <View style={styles.storyRingGap}>
        <Avatar uri={uri} name={name} size="lg" />
      </View>
    </View>
    <Text style={styles.storyName} numberOfLines={1}>{name.split(' ')[0]}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { resizeMode: 'cover' },
  placeholder: {
    backgroundColor: Colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },
  badge: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
  },
  verifiedBadge: {},
  onlineBadge: {
    backgroundColor: Colors.success,
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: Radius.full,
  },
  storyRingActive: {
    borderWidth: 2.5,
    borderColor: Colors.primary,
    padding: 2,
    borderRadius: Radius.full,
  },
  storyRingViewed: {
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 2,
    borderRadius: Radius.full,
  },

  // Story avatar
  storyWrapper: { alignItems: 'center', marginRight: 12 },
  storyRingOuter: {
    borderRadius: Radius.full,
    padding: 2,
  },
  storyRingGap: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    padding: 2,
  },
  storyName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
    maxWidth: 56,
    textAlign: 'center',
  },
});
