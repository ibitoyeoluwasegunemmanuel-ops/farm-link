import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'LiveChat'>;

const MSGS = [
  { id: '1', mine: false, text: 'Hello! Welcome to FarmLink Support. How can I help you today?', time: '10:00' },
];

export default function LiveChatScreen({ navigation }: Props) {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState(MSGS);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs(m => [...m, { id: Date.now().toString(), mine: true, text: msg.trim(), time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg('');
    setTimeout(() => {
      setMsgs(m => [...m, { id: (Date.now() + 1).toString(), mine: false, text: "Thank you for reaching out. An agent will respond shortly. Average wait time: 2 minutes.", time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Live Chat" subtitle="Support · Usually replies in 2 mins" showBack onBack={() => navigation.goBack()} />
      <FlatList data={msgs} keyExtractor={m => m.id} renderItem={({ item }) => (
        <View style={[styles.row, item.mine && styles.rowMine]}>
          <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
            <Text style={[styles.text, item.mine && styles.textMine]}>{item.text}</Text>
            <Text style={[styles.time, item.mine && styles.timeMine]}>{item.time}</Text>
          </View>
        </View>
      )} contentContainerStyle={styles.list} />
      <View style={styles.bar}>
        <View style={styles.inputWrap}><TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={Colors.textTertiary} value={msg} onChangeText={setMsg} multiline /></View>
        <TouchableOpacity style={[styles.sendBtn, !msg.trim() && styles.sendDisabled]} onPress={send}>
          <Ionicons name="send" size={18} color={msg.trim() ? Colors.white : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing[4] },
  row: { marginBottom: Spacing[3], alignItems: 'flex-start' },
  rowMine: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: Radius.lg, padding: Spacing[3] },
  bubbleTheirs: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.borderLight },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  text: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  textMine: { color: Colors.white },
  time: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary, marginTop: 4, alignSelf: 'flex-end' },
  timeMine: { color: 'rgba(255,255,255,0.6)' },
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing[2], padding: Spacing[3], paddingBottom: Platform.OS === 'ios' ? Spacing[5] : Spacing[3], backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  inputWrap: { flex: 1, backgroundColor: Colors.inputBg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], minHeight: 44, justifyContent: 'center' },
  input: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { backgroundColor: Colors.borderLight },
});
