import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { HomeNavigator } from './HomeNavigator';
import { MarketplaceNavigator } from './MarketplaceNavigator';
import { LogisticsNavigator } from './LogisticsNavigator';
import { WalletNavigator } from './WalletNavigator';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = 'home' | 'home-outline' | 'storefront' | 'storefront-outline' | 'cube' | 'cube-outline' | 'wallet' | 'wallet-outline' | 'person' | 'person-outline';

const TAB_CONFIG: Record<
  keyof MainTabParamList,
  { label: string; active: TabIconName; inactive: TabIconName }
> = {
  Home: { label: 'Home', active: 'home', inactive: 'home-outline' },
  Marketplace: { label: 'Market', active: 'storefront', inactive: 'storefront-outline' },
  Logistics: { label: 'Logistics', active: 'cube', inactive: 'cube-outline' },
  Wallet: { label: 'Wallet', active: 'wallet', inactive: 'wallet-outline' },
  Profile: { label: 'Profile', active: 'person', inactive: 'person-outline' },
};

export const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const cfg = TAB_CONFIG[route.name as keyof MainTabParamList];
        return {
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? cfg.active : cfg.inactive}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, { color }]}>{cfg.label}</Text>
          ),
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textTertiary,
          tabBarStyle: [
            styles.tabBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
          ],
          tabBarItemStyle: styles.tabItem,
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Marketplace" component={MarketplaceNavigator} />
      <Tab.Screen name="Logistics" component={LogisticsNavigator} />
      <Tab.Screen name="Wallet" component={WalletNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    height: Platform.OS === 'ios' ? 80 : 64,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    marginTop: 2,
  },
});
