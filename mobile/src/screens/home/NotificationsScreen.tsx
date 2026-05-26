import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;

const NOTIFS = [
  { id: '1', icon: 'heart', color: Colors.error, title: 'Emeka liked your post', time: '2m ago', unread: true },
  { id: '2', icon: 'cart', color: Colors.primary, title: 'New order: 20 bags of maize', time: '1h ago', unread: true },
  { id: '3', icon: 'cube', color: '#FF9800', title: 'Your delivery is on the way', time: '3h ago', unread: false },
  { id: '4', icon: 'checkmark-circle', color: Colors.success, title: 'KYC verification approved', time: '1d ago', unread: false },
];

export default function NotificationsScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Notifications" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={NOTIFS}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.item, item.unread && styles.itemUnread]}>
            <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing[4] },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[2],
    gap: Spacing[3],
  },
  itemUnread: { backgroundColor: Colors.primaryTint },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: 3 },
  time: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
