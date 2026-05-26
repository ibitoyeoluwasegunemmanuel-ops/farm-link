import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { NotifBadge } from './Badge';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  transparent?: boolean;
  dark?: boolean;     // dark bg, white icons
  style?: ViewStyle;
  titleCenter?: boolean;
  notifCount?: number;
  showSearch?: boolean;
  onSearch?: () => void;
  showNotif?: boolean;
  onNotif?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightActions,
  transparent = false,
  dark = false,
  style,
  titleCenter = false,
  notifCount = 0,
  showSearch = false,
  onSearch,
  showNotif = false,
  onNotif,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const iconColor = dark ? Colors.white : Colors.textPrimary;
  const titleColor = dark ? Colors.white : Colors.textPrimary;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 0) },
        transparent
          ? styles.transparent
          : dark
          ? { backgroundColor: Colors.splashBg }
          : { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
        style,
      ]}
    >
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={dark ? Colors.splashBg : Colors.white}
      />

      <View style={styles.row}>
        {/* Left: back button */}
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack || (() => navigation.goBack())}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: title */}
        {titleCenter ? (
          <View style={styles.titleCenter}>
            {title && (
              <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.titleLeft}>
            {title && (
              <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, dark && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Right: actions */}
        <View style={styles.right}>
          {showSearch && (
            <TouchableOpacity onPress={onSearch} style={styles.iconBtn}>
              <Ionicons name="search-outline" size={22} color={iconColor} />
            </TouchableOpacity>
          )}
          {showNotif && (
            <TouchableOpacity onPress={onNotif} style={styles.iconBtn}>
              <View>
                <Ionicons name="notifications-outline" size={22} color={iconColor} />
                {notifCount > 0 && (
                  <NotifBadge count={notifCount} style={styles.notifBadge} />
                )}
              </View>
            </TouchableOpacity>
          )}
          {rightActions}
        </View>
      </View>
    </View>
  );
};

// FarmLink home header - shows logo + search + notif
export const HomeHeader: React.FC<{
  userName?: string;
  notifCount?: number;
  onNotif?: () => void;
  onSearch?: () => void;
}> = ({ userName, notifCount = 0, onNotif, onSearch }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[homeStyles.container, { paddingTop: insets.top + 8 }]}>
      <View style={homeStyles.row}>
        {/* Logo */}
        <View style={homeStyles.logoRow}>
          <View style={homeStyles.logoLeaf}>
            <Ionicons name="leaf" size={20} color={Colors.white} />
          </View>
          <View>
            <Text style={homeStyles.logoText}>
              Farm<Text style={homeStyles.logoAccent}>Link</Text>
            </Text>
          </View>
        </View>

        {/* Right icons */}
        <View style={homeStyles.actions}>
          <TouchableOpacity onPress={onSearch} style={homeStyles.iconBtn}>
            <Ionicons name="search-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNotif} style={homeStyles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            {notifCount > 0 && (
              <NotifBadge count={notifCount} style={homeStyles.notifBadge} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  transparent: { backgroundColor: 'transparent' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  left: { width: 40, alignItems: 'flex-start' },
  right: { flex: 0, flexDirection: 'row', alignItems: 'center', minWidth: 40, justifyContent: 'flex-end' },
  titleCenter: { flex: 1, alignItems: 'center' },
  titleLeft: { flex: 1 },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.borderLight,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  notifBadge: { position: 'absolute', top: -4, right: -4 },
});

const homeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoLeaf: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  logoAccent: { color: Colors.primaryLight },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  notifBadge: { position: 'absolute', top: -4, right: -4 },
});
