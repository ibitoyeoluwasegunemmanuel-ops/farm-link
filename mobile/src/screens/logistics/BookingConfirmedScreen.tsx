import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Button } from '../../components/common';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'BookingConfirmed'>;

export default function BookingConfirmedScreen({ navigation, route }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(scale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={[Colors.splashBg, '#1A3524']} style={styles.container}>
      <Animated.View style={[styles.icon, { transform: [{ scale }] }]}>
        <Ionicons name="cube" size={52} color={Colors.white} />
      </Animated.View>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.sub}>Your truck is on the way. Driver has been notified and will pick up shortly.</Text>
      <Text style={styles.bookingId}>Booking #{route.params.bookingId}</Text>
      <Button label="Track Live" onPress={() => navigation.replace('LiveTracking', { bookingId: route.params.bookingId })} size="lg" style={styles.btn} />
      <Button label="Back to Logistics" onPress={() => navigation.popToTop()} size="lg" variant="outline" style={[styles.btn, { marginTop: Spacing[3] }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  icon: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[6], shadowColor: Colors.primaryLight, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.white, textAlign: 'center', marginBottom: Spacing[3] },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24, marginBottom: Spacing[3] },
  bookingId: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primaryLight, marginBottom: Spacing[8] },
  btn: { width: '100%' },
});
