import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AccountSettings'>;

export default function AccountSettingsScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <Header title="Account" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {[
            { icon: 'language-outline', label: 'Language', sub: 'English' },
            { icon: 'color-palette-outline', label: 'Theme', sub: 'Light' },
            { icon: 'download-outline', label: 'Download My Data', sub: 'Get a copy of your data' },
          ].map((item, i, arr) => (
            <TouchableOpacity key={item.label} style={[styles.item, i < arr.length - 1 && styles.border]}>
              <Ionicons name={item.icon as any} size={18} color={Colors.primary} style={styles.icon} />
              <View style={styles.info}><Text style={styles.label}>{item.label}</Text><Text style={styles.sub}>{item.sub}</Text></View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert('Delete Account', 'This action is permanent. Contact support@farmlink.ng to proceed.')}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteTxt}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing[4] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  item: { flexDirection: 'row', alignItems: 'center', padding: Spacing[4] },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  icon: { marginRight: Spacing[3] },
  info: { flex: 1 },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], marginTop: Spacing[6], padding: Spacing[4] },
  deleteTxt: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.error },
});
