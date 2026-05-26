import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';

type Props = NativeStackScreenProps<WalletStackParamList, 'ScanPay'>;

export default function ScanPayScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.title}>Scan QR Code</Text>
      <View style={styles.scanArea}>
        <View style={styles.corner1} /><View style={styles.corner2} />
        <View style={styles.corner3} /><View style={styles.corner4} />
        <Ionicons name="qr-code-outline" size={80} color="rgba(255,255,255,0.3)" />
      </View>
      <Text style={styles.hint}>Point camera at a FarmLink QR code to pay</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', gap: Spacing[6] },
  closeBtn: { position: 'absolute', top: 56, left: 20 },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  scanArea: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  corner1: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Colors.primary, borderTopLeftRadius: 8 },
  corner2: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: Colors.primary, borderTopRightRadius: 8 },
  corner3: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Colors.primary, borderBottomLeftRadius: 8 },
  corner4: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Colors.primary, borderBottomRightRadius: 8 },
  hint: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: Spacing[8] },
});
