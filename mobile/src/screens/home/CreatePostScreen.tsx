import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { storageService } from '../../services/storageService';
import { Avatar } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

type PostType = 'general' | 'sell' | 'buy' | 'knowledge' | 'news';

const POST_TYPES: { type: PostType; icon: string; label: string; color: string }[] = [
  { type: 'general', icon: 'chatbubble-outline', label: 'General', color: Colors.primary },
  { type: 'sell', icon: 'pricetag-outline', label: 'Sell Produce', color: '#2196F3' },
  { type: 'buy', icon: 'cart-outline', label: 'Buy Request', color: '#FF9800' },
  { type: 'knowledge', icon: 'book-outline', label: 'Knowledge', color: '#9C27B0' },
  { type: 'news', icon: 'newspaper-outline', label: 'News', color: '#F44336' },
];

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const [postType, setPostType] = useState<PostType>('general');
  const [content, setContent] = useState('');
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);

  const addMedia = async () => {
    if (mediaUris.length >= 4) {
      Alert.alert('Limit', 'You can attach up to 4 photos.');
      return;
    }
    const asset = await storageService.pickImage(false, [4, 3]);
    if (asset) setMediaUris((prev) => [...prev, asset.uri]);
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }
    setLoading(true);
    try {
      // TODO: call API
      await new Promise((r) => setTimeout(r, 800));
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not publish post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = POST_TYPES.find((t) => t.type === postType)!;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Create Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          style={[styles.postBtn, !content.trim() && styles.postBtnDisabled]}
          disabled={!content.trim() || loading}
        >
          <Text style={styles.postBtnText}>{loading ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Author info */}
        <View style={styles.authorRow}>
          <Avatar uri={user?.avatarUri} name={user?.name || 'You'} size="md" />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{user?.name || 'Your Name'}</Text>
            {/* Post type selector */}
            <TouchableOpacity style={[styles.typeChip, { borderColor: selectedType.color }]}>
              <Ionicons name={selectedType.icon as any} size={12} color={selectedType.color} />
              <Text style={[styles.typeChipText, { color: selectedType.color }]}>{selectedType.label}</Text>
              <Ionicons name="chevron-down" size={12} color={selectedType.color} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post type tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesRow}>
          {POST_TYPES.map((t) => (
            <TouchableOpacity
              key={t.type}
              style={[styles.typeTab, postType === t.type && { backgroundColor: t.color + '20', borderColor: t.color }]}
              onPress={() => setPostType(t.type)}
            >
              <Ionicons name={t.icon as any} size={14} color={postType === t.type ? t.color : Colors.textSecondary} />
              <Text style={[styles.typeTabText, postType === t.type && { color: t.color }]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Text area */}
        <TextInput
          style={styles.textArea}
          placeholder={
            postType === 'sell'
              ? "What produce are you selling? Describe quality, quantity, location..."
              : postType === 'buy'
              ? "What are you looking to buy? Quantity needed, location, budget..."
              : "Share farming tips, news, or anything with the community..."
          }
          placeholderTextColor={Colors.textTertiary}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
        />

        {/* Sell-specific fields */}
        {postType === 'sell' && (
          <View style={styles.sellFields}>
            <View style={styles.priceRow}>
              <View style={styles.priceInput}>
                <Text style={styles.fieldLabel}>Price (₦)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. 8500"
                  keyboardType="number-pad"
                  value={price}
                  onChangeText={setPrice}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={styles.unitInput}>
                <Text style={styles.fieldLabel}>Per Unit</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="bag / kg / crate"
                  value={unit}
                  onChangeText={setUnit}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>
          </View>
        )}

        {/* Media previews */}
        {mediaUris.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
            {mediaUris.map((uri, i) => (
              <View key={i} style={styles.mediaThumb}>
                <Image source={{ uri }} style={styles.mediaImg} />
                <TouchableOpacity
                  style={styles.removeMedia}
                  onPress={() => setMediaUris((prev) => prev.filter((_, j) => j !== i))}
                >
                  <Ionicons name="close-circle" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Tags */}
        <View style={styles.tagsSection}>
          <View style={styles.tagInputRow}>
            <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag (e.g. cassava)"
              placeholderTextColor={Colors.textTertiary}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((t) => (
                <TouchableOpacity key={t} style={styles.tagChip} onPress={() => removeTag(t)}>
                  <Text style={styles.tagText}>#{t}</Text>
                  <Ionicons name="close" size={12} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={addMedia}>
          <Ionicons name="image-outline" size={22} color={Colors.primary} />
          <Text style={styles.toolText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Ionicons name="location-outline" size={22} color={Colors.primary} />
          <Text style={styles.toolText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}>
          <Ionicons name="people-outline" size={22} color={Colors.primary} />
          <Text style={styles.toolText}>Tag</Text>
        </TouchableOpacity>
        <View style={styles.charCount}>
          <Text style={[styles.charText, content.length > 400 && { color: Colors.error }]}>
            {500 - content.length}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingTop: Platform.OS === 'ios' ? 56 : Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cancelBtn: { padding: 4 },
  topTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
  },
  postBtnDisabled: { backgroundColor: Colors.border },
  postBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing[4] },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  authorInfo: { gap: 4 },
  authorName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  typeChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  typesRow: { marginBottom: Spacing[4] },
  typeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    marginRight: Spacing[2],
  },
  typeTabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  textArea: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 26,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: Spacing[4],
  },
  sellFields: { marginBottom: Spacing[4] },
  priceRow: { flexDirection: 'row', gap: Spacing[3] },
  priceInput: { flex: 2 },
  unitInput: { flex: 1 },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  mediaRow: { marginBottom: Spacing[4] },
  mediaThumb: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    marginRight: Spacing[2],
    position: 'relative',
    overflow: 'hidden',
  },
  mediaImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeMedia: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  tagsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing[3],
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  tagInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    paddingBottom: Platform.OS === 'ios' ? Spacing[6] : Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  toolText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  spacer: { flex: 1 },
  charCount: { marginLeft: 'auto' },
  charText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
