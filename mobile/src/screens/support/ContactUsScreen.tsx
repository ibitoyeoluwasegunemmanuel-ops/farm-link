import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ContactUs'>;

export default function ContactUsScreen({ navigation }: Props) {
  const contacts = [
    { icon: 'chatbubble-ellipses-outline', label: 'Live Chat', sub: 'Available 9am-6pm WAT', onPress: () => navigation.navigate('LiveChat'), color: Colors.primary },
    { icon: 'mail-outline', label: 'Email Support', sub: 'support@farmlink.ng', onPress: () => Linking.openURL('mailto:support@farmlink.ng'), color: '#2196F3' },
    { icon: 'call-outline', label: 'Call Us', sub: '+234 800 FARMLINK', onPress: () => Linking.openURL('tel:+2348003276546'), color: Colors.success },
    { icon: 'logo-whatsapp', label: 'WhatsApp', sub: '+234 800 FARMLINK', onPress: () => {}, color: '#25D366' },
  ];
  return (
    <View style={styles.flex}>
      <Header title="Contact Us" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {contacts.map((c, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={c.onPress}>
            <View style={[styles.icon, { backgroundColor: c.color + '20' }]}>
              <Ionicons name={c.icon as any} size={24} color={c.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>{c.label}</Text>
              <Text style={styles.sub}>{c.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderWidth: 1, borderColor: Colors.borderLight },
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
});
