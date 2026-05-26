import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Avatar, VerifiedBadge } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

type MenuSection = {
  title: string;
  items: { icon: string; label: string; route?: keyof ProfileStackParamList; badge?: string; color?: string; onPress?: () => void }[];
};

export default function ProfileScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const MENU_SECTIONS: MenuSection[] = [
    {
      title: 'My Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', route: 'EditProfile' },
        { icon: 'shield-checkmark-outline', label: 'KYC & Verification', badge: user?.kycCompleted ? 'Verified' : 'Pending' },
        { icon: 'wallet-outline', label: 'Wallet & Payments', color: '#9C27B0' },
      ],
    },
    {
      title: 'Farm Tools',
      items: [
        { icon: 'leaf-outline', label: 'AI Farm Assistant', route: 'AIAssistant', color: Colors.primary },
        { icon: 'scan-outline', label: 'Crop Disease Scanner', route: 'CropScanner', color: Colors.primaryLight },
        { icon: 'trending-up-outline', label: 'Market Prices', route: 'MarketPrices', color: '#2196F3' },
        { icon: 'partly-sunny-outline', label: 'Weather Forecast', route: 'Weather', color: '#FF9800' },
        { icon: 'book-outline', label: 'Knowledge Hub', route: 'Knowledge', color: '#9C27B0' },
      ],
    },
    {
      title: 'Business',
      items: [
        { icon: 'construct-outline', label: 'Equipment Rental', route: 'Equipment' },
        { icon: 'cash-outline', label: 'Farm Finance', route: 'Finance' },
        { icon: 'bar-chart-outline', label: 'Investor Network', route: 'Investors' },
        { icon: 'car-outline', label: 'Fleet Management', route: 'Fleet' },
      ],
    },
    {
      title: 'Settings & Support',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', route: 'NotificationSettings' },
        { icon: 'lock-closed-outline', label: 'Privacy', route: 'PrivacySettings' },
        { icon: 'shield-outline', label: 'Security', route: 'SecuritySettings' },
        { icon: 'settings-outline', label: 'Account Settings', route: 'AccountSettings' },
        { icon: 'help-circle-outline', label: 'Help & Support', route: 'HelpSupport' },
        { icon: 'chatbubbles-outline', label: 'Contact Us', route: 'ContactUs' },
      ],
    },
    {
      title: '',
      items: [
        { icon: 'log-out-outline', label: 'Sign Out', color: Colors.error, onPress: () => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: logout }]) },
      ],
    },
  ];

  return (
    <View style={styles.flex}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <LinearGradient colors={[Colors.splashBg, '#1B5E20']} style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar
              uri={user?.avatarUri}
              name={user?.name || 'User'}
              size="xl"
              verified={user?.verified}
              onPress={() => navigation.navigate('EditProfile')}
            />
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                {user?.verified && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primaryLight} style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text style={styles.role}>{user?.role?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Farmer'}</Text>
              {user?.state && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.location}>{user.state}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Listings', value: '12' },
              { label: 'Sales', value: '48' },
              { label: 'Rating', value: '4.9' },
              { label: 'Since', value: '2023' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={item.onPress || (item.route ? () => navigation.navigate(item.route as any) : undefined)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: (item.color || Colors.primary) + '15' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color || Colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, item.color === Colors.error && { color: Colors.error }]}>
                    {item.label}
                  </Text>
                  <View style={styles.menuRight}>
                    {item.badge && (
                      <View style={[styles.badge, item.badge === 'Verified' ? styles.badgeGreen : styles.badgeOrange]}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    {item.route && (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>FarmLink v1.0.0 · Made with ❤️ for African farmers</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing[4], paddingBottom: Spacing[5] },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4], marginBottom: Spacing[5] },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  name: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  role: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 4, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.65)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.lg, padding: Spacing[4] },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.white },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  section: { paddingHorizontal: Spacing[4], marginTop: Spacing[4] },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[2], textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingHorizontal: Spacing[4], paddingVertical: Spacing[4] },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  badge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  badgeGreen: { backgroundColor: Colors.success + '20' },
  badgeOrange: { backgroundColor: Colors.warning + '20' },
  badgeText: { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.success },
  version: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'center', padding: Spacing[6] },
});
