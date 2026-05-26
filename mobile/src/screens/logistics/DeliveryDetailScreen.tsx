import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, StatusBadge } from '../../components/common';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'DeliveryDetail'>;

export default function DeliveryDetailScreen({ navigation, route }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Delivery Details" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.label}>Booking ID</Text><Text style={styles.val}>{route.params.deliveryId}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Status</Text><StatusBadge status="delivered" /></View>
          <View style={styles.row}><Text style={styles.label}>Route</Text><Text style={styles.val}>Lagos → Abuja</Text></View>
          <View style={styles.row}><Text style={styles.label}>Driver</Text><Text style={styles.val}>Ibrahim Musa</Text></View>
          <View style={styles.row}><Text style={styles.label}>Vehicle</Text><Text style={styles.val}>AGL-234-XY (Pickup)</Text></View>
          <View style={styles.row}><Text style={styles.label}>Cost</Text><Text style={styles.val}>₦35,000</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing[3] },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  val: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
});
