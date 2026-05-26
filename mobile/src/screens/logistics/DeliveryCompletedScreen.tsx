import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Button } from '../../components/common';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'DeliveryCompleted'>;

export default function DeliveryCompletedScreen({ navigation }: Props) {
  return (
    <LinearGradient colors={[Colors.splashBg, '#122E1A']} style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="checkmark-circle" size={64} color={Colors.white} />
      </View>
      <Text style={styles.title}>Delivery Complete!</Text>
      <Text style={styles.sub}>Payment has been released to the driver. Thank you for using FarmLink Logistics!</Text>
      <View style={styles.rateSection}>
        <Text style={styles.rateTitle}>Rate your driver</Text>
        <View style={styles.stars}>
          {[1,2,3,4,5].map(i => <Ionicons key={i} name={i <= 4 ? 'star' : 'star-outline'} size={36} color="#F59E0B" />)}
        </View>
      </View>
      <Button label="Back to Logistics" onPress={() => navigation.popToTop()} size="lg" style={styles.btn} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  icon: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[6] },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.white, textAlign: 'center', marginBottom: Spacing[3] },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24, marginBottom: Spacing[6] },
  rateSection: { alignItems: 'center', marginBottom: Spacing[8] },
  rateTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white, marginBottom: Spacing[3] },
  stars: { flexDirection: 'row', gap: Spacing[2] },
  btn: { width: '100%' },
});
