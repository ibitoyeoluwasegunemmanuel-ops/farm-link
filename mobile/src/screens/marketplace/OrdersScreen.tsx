import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, StatusBadge } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Orders'>;

const ORDERS = [
  { id: 'ORD001', items: 'White Maize × 10', total: 569500, status: 'in_transit', date: 'Dec 5, 2024' },
  { id: 'ORD002', items: 'Cassava × 5 bags', total: 47500, status: 'delivered', date: 'Nov 28, 2024' },
  { id: 'ORD003', items: 'Fresh Tomatoes × 3', total: 41500, status: 'pending', date: 'Nov 20, 2024' },
];

export default function OrdersScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="My Orders" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={ORDERS}
        keyExtractor={o => o.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <View style={styles.topRow}>
              <Text style={styles.orderId}>{item.id}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.items}>{item.items}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.total}>{formatCurrency(item.total)}</Text>
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
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[2] },
  orderId: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  items: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[2] },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary },
  total: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.primary },
});
