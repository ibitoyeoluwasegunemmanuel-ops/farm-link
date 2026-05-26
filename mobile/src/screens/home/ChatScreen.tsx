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
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<HomeStackParamList, 'Chat'>;

const MSGS = [
  { id: '1', mine: false, text: 'Hello! I saw your cassava listing. Is it still available?', time: '10:00' },
  { id: '2', mine: true, text: 'Yes, still available! How many bags do you need?', time: '10:02' },
  { id: '3', mine: false, text: 'I need 50 bags. Can you do delivery to Abuja?', time: '10:05' },
  { id: '4', mine: true, text: "Yes we can. Delivery to Abuja is ₦45,000 extra. Total would be ₦470,000.", time: '10:07' },
  { id: '5', mine: false, text: 'That works. Can I pay through FarmLink escrow?', time: '10:10' },
];

export default function ChatScreen({ navigation, route }: Props) {
  const { userName } = route.params;
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title={userName} showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={MSGS}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.mine && styles.msgRowMine]}>
            <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
              <Text style={[styles.msgText, item.mine && styles.msgTextMine]}>{item.text}</Text>
              <Text style={[styles.msgTime, item.mine && styles.msgTimeMine]}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="attach" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <TouchableOpacity style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}>
          <Ionicons name="send" size={18} color={message.trim() ? Colors.white : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing[4], paddingBottom: 8 },
  msgRow: { marginBottom: Spacing[3], alignItems: 'flex-start' },
  msgRowMine: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing[3],
    paddingBottom: Spacing[2],
  },
  bubbleTheirs: { backgroundColor: Colors.white, borderBottomLeftRadius: 4 },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  msgTextMine: { color: Colors.white },
  msgTime: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary, marginTop: 4, alignSelf: 'flex-end' },
  msgTimeMine: { color: 'rgba(255,255,255,0.6)' },
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
  attachBtn: { padding: Spacing[2] },
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
  input: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, maxHeight: 100 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.borderLight },
});
