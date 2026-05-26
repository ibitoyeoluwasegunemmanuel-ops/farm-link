import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AIAssistant'>;

const SUGGESTED = [
  'What is the best time to plant cassava?',
  'How do I treat leaf blight on tomatoes?',
  'Current maize price in Lagos?',
  'How much fertilizer per hectare for maize?',
];

const MSGS = [
  { id: '0', mine: false, text: "Hello! I'm FarmLink AI, your personal agriculture assistant. Ask me anything about farming, crop prices, disease diagnosis, weather, or market insights." }
];

export default function AIAssistantScreen({ navigation }: Props) {
  const [msgs, setMsgs] = useState(MSGS);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMsg = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs(m => [...m, { id: Date.now().toString(), mine: true, text: q }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setMsgs(m => [...m, { id: (Date.now() + 1).toString(), mine: false, text: `Great question! Based on agricultural data for Nigeria: ${q.toLowerCase().includes('cassava') ? 'The best time to plant cassava in Nigeria is between March–April (rainy season) when soil moisture is adequate.' : 'I recommend consulting your local agricultural extension officer for location-specific advice. In general, maintain soil pH 6.0–7.0, apply compound NPK fertilizer, and ensure adequate drainage.'}` }]);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.headerGrad}>
        <Header title="AI Farm Assistant" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.aiIcon}>
          <Ionicons name="leaf" size={28} color={Colors.white} />
        </View>
        <Text style={styles.aiSub}>Powered by FarmLink Intelligence</Text>
      </LinearGradient>

      <FlatList
        data={msgs}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <View style={[styles.row, item.mine && styles.rowMine]}>
            {!item.mine && (
              <View style={styles.aiAvatar}>
                <Ionicons name="leaf" size={14} color={Colors.white} />
              </View>
            )}
            <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleAI]}>
              <Text style={[styles.text, item.mine && styles.textMine]}>{item.text}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={loading ? (
          <View style={[styles.row]}>
            <View style={styles.aiAvatar}><Ionicons name="leaf" size={14} color={Colors.white} /></View>
            <View style={styles.bubbleAI}>
              <Text style={styles.typing}>Thinking...</Text>
            </View>
          </View>
        ) : null}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          msgs.length === 1 ? (
            <View style={styles.suggestions}>
              <Text style={styles.sugTitle}>Try asking:</Text>
              <View style={styles.sugGrid}>
                {SUGGESTED.map((s, i) => (
                  <TouchableOpacity key={i} style={styles.sugChip} onPress={() => sendMsg(s)}>
                    <Text style={styles.sugText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bar}>
        <TouchableOpacity style={styles.cameraBtn} onPress={() => navigation.navigate('CropScanner')}>
          <Ionicons name="camera" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput style={styles.input} placeholder="Ask me anything about farming..." placeholderTextColor={Colors.textTertiary} value={input} onChangeText={setInput} multiline />
        </View>
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendDisabled]} onPress={() => sendMsg(input)}>
          <Ionicons name="send" size={18} color={input.trim() ? Colors.white : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: Spacing[4], alignItems: 'center' },
  aiIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[2] },
  aiSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)' },
  list: { padding: Spacing[4], paddingBottom: 8 },
  suggestions: { marginBottom: Spacing[4] },
  sugTitle: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[3] },
  sugGrid: { gap: Spacing[2] },
  sugChip: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  sugText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing[2], marginBottom: Spacing[3] },
  rowMine: { flexDirection: 'row-reverse' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '78%', borderRadius: Radius.lg, padding: Spacing[3] },
  bubbleAI: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.borderLight },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  text: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 22 },
  textMine: { color: Colors.white },
  typing: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textTertiary, fontStyle: 'italic' },
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing[2], padding: Spacing[3], paddingBottom: Platform.OS === 'ios' ? Spacing[5] : Spacing[3], backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  cameraBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, backgroundColor: Colors.inputBg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], minHeight: 44, justifyContent: 'center' },
  input: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { backgroundColor: Colors.borderLight },
});
