import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button } from '../../components/common';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen({ navigation, route }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(scale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={[Colors.splashBg, '#122E1A']} style={styles.container}>
      <Animated.View style={[styles.checkWrap, { transform: [{ scale }] }]}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={52} color={Colors.white} />
        </View>
      </Animated.View>

      <Text style={styles.title}>Order Placed! 🎉</Text>
      <Text style={styles.subtitle}>
        Your order has been placed successfully.{'\n'}Payment is held in escrow until delivery.
      </Text>
      <Text style={styles.orderId}>Order #{route.params.orderId}</Text>

      <View style={styles.steps}>
        {['Order Confirmed', 'Farmer Preparing', 'Out for Delivery', 'Delivered'].map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              {i === 0 ? <Ionicons name="checkmark" size={12} color={Colors.white} /> : null}
            </View>
            <Text style={[styles.stepText, i === 0 && styles.stepTextActive]}>{step}</Text>
            {i < 3 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>

      <Button label="Track Order" onPress={() => navigation.replace('Orders')} size="lg" style={styles.btn} />
      <Button label="Continue Shopping" onPress={() => navigation.popToTop()} size="lg" variant="outline" style={[styles.btn, { marginTop: Spacing[3] }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  checkWrap: { marginBottom: Spacing[6] },
  check: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primaryLight, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.white, textAlign: 'center', marginBottom: Spacing[3] },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24, marginBottom: Spacing[3] },
  orderId: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.primaryLight, marginBottom: Spacing[8] },
  steps: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing[8] },
  step: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotActive: { backgroundColor: Colors.primary },
  stepText: { fontFamily: FontFamily.regular, fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  stepTextActive: { color: Colors.primaryLight, fontFamily: FontFamily.medium },
  stepLine: { position: 'absolute', left: '50%', top: 11, width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  btn: { width: '100%' },
});
