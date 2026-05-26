import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, SearchBar } from '../../components/common';
type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpSupport'>;

export default function HelpSupportScreen({ navigation }: Props) {
  const [search, setSearch] = React.useState('');
  const ITEMS = [
    { icon: 'help-circle-outline', label: 'FAQ', sub: 'Common questions answered', route: 'FAQ' as const },
    { icon: 'chatbubbles-outline', label: 'Contact Us', sub: 'Chat, email or call', route: 'ContactUs' as const },
    { icon: 'chatbubble-ellipses-outline', label: 'Live Chat', sub: 'Chat with support agents', route: 'LiveChat' as const },
    { icon: 'flag-outline', label: 'Report Issue', sub: 'Report bugs or problems', route: 'ReportIssue' as const },
    { icon: 'ticket-outline', label: 'My Tickets', sub: 'Track support requests', route: 'Tickets' as const },
  ];

  return (
    <View style={styles.flex}>
      <Header title="Help & Support" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search help articles..." style={styles.search} />
        <View style={styles.card}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity key={item.label} style={[styles.item, i < ITEMS.length - 1 && styles.border]} onPress={() => navigation.navigate(item.route)}>
              <View style={styles.iconWrap}><Ionicons name={item.icon as any} size={18} color={Colors.primary} /></View>
              <View style={styles.info}><Text style={styles.label}>{item.label}</Text><Text style={styles.sub}>{item.sub}</Text></View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  search: { marginBottom: Spacing[4] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[4] },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});
