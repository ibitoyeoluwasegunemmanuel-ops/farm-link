import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/profile/PrivacySettingsScreen';
import SecuritySettingsScreen from '../screens/profile/SecuritySettingsScreen';
import AccountSettingsScreen from '../screens/profile/AccountSettingsScreen';
import HelpSupportScreen from '../screens/support/HelpSupportScreen';
import FAQScreen from '../screens/support/FAQScreen';
import ContactUsScreen from '../screens/support/ContactUsScreen';
import LiveChatScreen from '../screens/support/LiveChatScreen';
import ReportIssueScreen from '../screens/support/ReportIssueScreen';
import TicketsScreen from '../screens/support/TicketsScreen';
import AIAssistantScreen from '../screens/ai/AIAssistantScreen';
import CropScannerScreen from '../screens/ai/CropScannerScreen';
import MarketPricesScreen from '../screens/features/MarketPricesScreen';
import WeatherScreen from '../screens/features/WeatherScreen';
import KnowledgeScreen from '../screens/features/KnowledgeScreen';
import EquipmentScreen from '../screens/features/EquipmentScreen';
import FinanceScreen from '../screens/features/FinanceScreen';
import InvestorsScreen from '../screens/features/InvestorsScreen';
import FleetScreen from '../screens/features/FleetScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
    <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
    <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
    <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    <Stack.Screen name="LiveChat" component={LiveChatScreen} />
    <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
    <Stack.Screen name="Tickets" component={TicketsScreen} />
    <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
    <Stack.Screen name="CropScanner" component={CropScannerScreen} />
    <Stack.Screen name="MarketPrices" component={MarketPricesScreen} />
    <Stack.Screen name="Weather" component={WeatherScreen} />
    <Stack.Screen name="Knowledge" component={KnowledgeScreen} />
    <Stack.Screen name="Equipment" component={EquipmentScreen} />
    <Stack.Screen name="Finance" component={FinanceScreen} />
    <Stack.Screen name="Investors" component={InvestorsScreen} />
    <Stack.Screen name="Fleet" component={FleetScreen} />
  </Stack.Navigator>
);
