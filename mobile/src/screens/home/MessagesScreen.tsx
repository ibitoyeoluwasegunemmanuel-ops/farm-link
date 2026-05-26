import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, Avatar } from '../../components/common';

type Props = NativeStackScreenProps<HomeStackParamList, 'Messages'>;

const CHATS = [
  { id: '1', name: 'Emeka Okafor', lastMsg: 'Can you deliver by Friday?', time: '2m', unread: 3 },
  { id: '2', name: 'FarmLink Support', lastMsg: 'Your KYC has been approved!', time: '1h', unread: 0 },
  { id: '3', name: 'Biodun Ojo', lastMsg: 'Price confirmed. Will pay now.', time: '3h', unread: 1 },
];

export default function MessagesScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Messages" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={CHATS}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Chat', { userId: item.id, userName: item.name })}
          >
            <Avatar name={item.name} size="md" online={item.unread > 0} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.lastRow}>
                <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgBold]} numberOfLines={1}>{item.lastMsg}</Text>
                {item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
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
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  time: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  lastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastMsg: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  lastMsgBold: { fontFamily: FontFamily.medium, color: Colors.textPrimary },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.white },
});
