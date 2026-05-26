import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, PostCard, Avatar } from '../../components/common';

type Props = NativeStackScreenProps<HomeStackParamList, 'PostDetail'>;

const SAMPLE_COMMENTS = [
  { id: '1', name: 'Biodun Ojo', timeAgo: '1h ago', text: 'Great harvest! I need 50 bags, how do I place an order?', likes: 5 },
  { id: '2', name: 'Chidi Nwosu', timeAgo: '2h ago', text: 'What variety of cassava is this? Looks healthy!', likes: 2 },
  { id: '3', name: 'Sarah Musa', timeAgo: '3h ago', text: 'Interested. Do you deliver to Ibadan?', likes: 1 },
];

export default function PostDetailScreen({ navigation, route }: Props) {
  const [comment, setComment] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Header
        title="Post"
        showBack
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={SAMPLE_COMMENTS}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          <PostCard
            id={route.params.postId}
            authorName="Emeka Okafor"
            authorRole="Verified Farmer"
            verified
            timeAgo="2h ago"
            content="Fresh cassava harvest just came in! 500 bags available at ₦8,500 per bag. Delivery available across Lagos and Ogun state."
            likesCount={142}
            commentsCount={28}
            sharesCount={15}
            tags={['cassava', 'harvest']}
            showBuyButton
            productPrice={8500}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Avatar name={item.name} size="sm" />
            <View style={styles.commentBody}>
              <View style={styles.commentBubble}>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
              <View style={styles.commentMeta}>
                <Text style={styles.commentTime}>{item.timeAgo}</Text>
                <TouchableOpacity style={styles.likeBtn}>
                  <Ionicons name="heart-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.likeCount}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.replyBtn}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Comment input */}
      <View style={styles.inputBar}>
        <Avatar name="You" size="sm" />
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={Colors.textTertiary}
            value={comment}
            onChangeText={setComment}
            multiline
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, !comment.trim() && styles.sendBtnDisabled]}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={18} color={comment.trim() ? Colors.primary : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 20 },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
  },
  commentBody: { flex: 1 },
  commentBubble: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: 4,
  },
  commentName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  commentText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingLeft: Spacing[2],
  },
  commentTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  likeCount: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  replyBtn: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing[3],
    paddingBottom: Platform.OS === 'ios' ? Spacing[5] : Spacing[3],
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing[2],
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: { padding: Spacing[2] },
  sendBtnDisabled: { opacity: 0.4 },
});
